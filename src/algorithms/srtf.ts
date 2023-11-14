// @ts-nocheck
import {
  AlgorithmResult,
  AlgorithmResultData,
  ChartData,
  TableData,
} from "../types";
import { deepCopy, formatChartData} from "./helper";

const srtf = (tableData: TableData[]): AlgorithmResultData => {
  tableData.sort((a, b) => +a.arrivalTime - +b.arrivalTime || (a.burstTime - b.burstTime));
  const cloneTableData = deepCopy(tableData) as TableData[];
  console.log(cloneTableData);
  cloneTableData.sort((a, b) => +a.arrivalTime - +b.arrivalTime || (a.burstTime - b.burstTime));
  console.log(cloneTableData);

  let currentTime = +cloneTableData[0].arrivalTime;

  const queue: TableData[] = [];
  const ganttChartData: ChartData[] = [];
  const algorithmResult: AlgorithmResult[] = cloneTableData.map((item) => (
    {
    ...item,
    endTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
  }));

  let allBurst = cloneTableData.reduce(
    (acc, curr) => +acc + +curr.burstTime,
    0
  );

  queue.push({...cloneTableData[0]});

  if (+cloneTableData[0].arrivalTime !== 0) {
    ganttChartData.push({
      id: "-",
      start: 0,
      end: +cloneTableData[0].arrivalTime,
    }); 
  }

  while (allBurst > 0) {
    let timeMove = 0;
    const interruptingProcessIndx = 
        cloneTableData.findIndex((item) => +item.arrivalTime <= currentTime + queue[0].burstTime && !queue.some(process => process.id === item.id) && item.burstTime !== 0);

    if (interruptingProcessIndx !== -1) {
        timeMove = cloneTableData[interruptingProcessIndx]?.arrivalTime as number - currentTime;
        queue.push({...cloneTableData[interruptingProcessIndx] as TableData});
    } else {
        timeMove = queue[0].burstTime;
    }
    currentTime += timeMove;
    queue[0].burstTime -= timeMove;
    console.log('asd', JSON.stringify(queue), currentTime)
    ganttChartData.push({
        id: queue[0]?.id ?? '-',
        start: currentTime - timeMove,
        end: currentTime,
    })
    const processIndx = algorithmResult.findIndex((item) => item.id === queue[0].id);
    console.log('qwe', JSON.stringify(queue), currentTime, queue[0].burstTime)
    cloneTableData[processIndx].burstTime -= timeMove;
    if (queue[0].burstTime <= 0) {
        algorithmResult[processIndx].endTime = currentTime;
        algorithmResult[processIndx].turnaroundTime = currentTime - +algorithmResult[processIndx].arrivalTime;
        algorithmResult[processIndx].waitingTime = algorithmResult[processIndx].turnaroundTime - +algorithmResult[processIndx].burstTime;
        queue.shift()
    }
    console.log('zxc', JSON.stringify(queue), currentTime)
    queue.sort((a, b) => +a.burstTime - +b.burstTime);
    allBurst = cloneTableData.reduce(
        (acc, curr) => +acc + +curr.burstTime,
        0
    );
  }

  return {
    algorithmResult,
    averageTime: {
        turnaroundTime: algorithmResult.reduce((acc, curr) => acc + curr.turnaroundTime, 0) / algorithmResult.length,
        waitingTime: algorithmResult.reduce((acc, curr) => acc + curr.waitingTime, 0) / algorithmResult.length,
    },
    ganttChartData: formatChartData(ganttChartData),
  };
};

export default srtf;
