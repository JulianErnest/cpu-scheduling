import { AlgorithmResult, AlgorithmResultData, ChartData, TableData } from "../types";

const sjfAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  // Sort the processes based on arrival time and burst time
  const algorithmResult: AlgorithmResult[] = tableData.map((item) => 
  ({  ...item, endTime: 0, turnaroundTime: 0, waitingTime: 0 }));
  const sortedTableData = tableData.sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime || +a.burstTime - +b.burstTime
  );

  


  const chartData: ChartData[] = [];

  let currentTime = 0;

  if (currentTime !== +sortedTableData[0].arrivalTime) {
    chartData.push({
      start: 0,
      end: +sortedTableData[0].arrivalTime,
      id: '-'
    });
    currentTime = +sortedTableData[0].arrivalTime;
  }



  console.log(JSON.stringify(sortedTableData[0]))
  currentTime += sortedTableData[0].burstTime
  chartData.push({
    start: currentTime - sortedTableData[0].burstTime,
    end: currentTime,
    id: sortedTableData[0].id,
  });
  sortedTableData[0].burstTime = 0;

  let allBurst = sortedTableData.reduce((acc, curr) => +acc + +curr.burstTime, 0);
  const readyQueue: TableData[] = [];
  readyQueue.push(sortedTableData[0]);
  while (allBurst > 0) {
    console.log(currentTime)
    for (let i = 0; i <sortedTableData.length; i++) {
      const index = readyQueue.findIndex((val) => val.id === sortedTableData[i].id);
      console.log(index)
      if (sortedTableData[i].burstTime != 0 && +sortedTableData[i].arrivalTime <= currentTime && index === -1) {
        readyQueue.push(sortedTableData[i]);
      }
    }
    readyQueue.sort((a, b) => +a.burstTime - +b.burstTime);
    readyQueue.shift();
    const index = sortedTableData.findIndex((item) => item.id === readyQueue[0]?.id);
    chartData.push({
      start: currentTime,
      end: currentTime + sortedTableData[index].burstTime,
      id: tableData[index].id,
    })
    currentTime += readyQueue[0].burstTime;
    sortedTableData[index].burstTime = 0;

    algorithmResult[index].endTime = currentTime;
    algorithmResult[index].turnaroundTime = currentTime - +tableData[index]?.arrivalTime;
    algorithmResult[index].waitingTime = algorithmResult[index].turnaroundTime - +algorithmResult[index]?.burstTime;
 
    allBurst = sortedTableData.reduce((acc, curr) => acc + +curr.burstTime, 0);
  }

  
  return {
    algorithmResult: algorithmResult,
    averageTime: {
      turnaroundTime: algorithmResult.reduce((acc, curr) => acc + curr.turnaroundTime, 0) / algorithmResult.length,
      waitingTime: algorithmResult.reduce((acc, curr) => acc + curr.waitingTime, 0) / algorithmResult.length,
    },
    ganttChartData: chartData,
  };
};

export default sjfAlgorithm;
