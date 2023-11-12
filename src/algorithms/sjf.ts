import { AlgorithmResultData, ChartData, TableData } from "../types";

const sjfAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  // Sort the processes based on arrival time and burst time
  const sortedTableData = [...tableData].sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime || +a.burstTime - +b.burstTime
  );
  const chartData: ChartData[] = [];

  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  if (currentTime !== +sortedTableData[0].arrivalTime) {
    chartData.push({
      start: 0,
      end: +sortedTableData[0].arrivalTime,
      id: '-'
    });
    currentTime = +sortedTableData[0].arrivalTime;
  }

  const sjfResult = sortedTableData.map((process) => {
    if (currentTime < +process.arrivalTime) {
      currentTime = +process.arrivalTime;
    }

    const waitingTime = currentTime - +process.arrivalTime;
    const endTime = currentTime + +process.burstTime;
    const turnaroundTime = endTime - +process.arrivalTime;

    chartData.push({
      start: currentTime,
      end: endTime,
      id: process.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    currentTime = endTime;

    return {
      ...process,
      endTime,
      turnaroundTime,
      waitingTime,
    };
  });

  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  return {
    algorithmResult: sjfResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

export default sjfAlgorithm;
