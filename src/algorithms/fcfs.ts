import { AlgorithmResultData, ChartData, TableData } from "../types";

const fcfsAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  // Sort the processes based on arrival time
  const initializedTableData = tableData.map(row => ({ ...row, executionTime: 0 }));

  const sortedTableData = [...initializedTableData].sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime
  );
  const chartData: ChartData[] = [];

  let currentTime = 0;
  let endTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  if (currentTime !== +sortedTableData[0].arrivalTime) {
    chartData.push({
      start: 0,
      end: +sortedTableData[0].arrivalTime,
      id: "-",
    });
  }

  const fcfsResult = sortedTableData.map((process) => {
    if (currentTime < +process.arrivalTime) {
      if (currentTime != 0) {
        chartData.push({
          start: currentTime,
          end: +process.arrivalTime,
          id: "-",
        });
      }

      currentTime = +process.arrivalTime;
    }

    endTime = currentTime + +process.burstTime;
    const turnaroundTime = endTime - +process.arrivalTime;
    const waitingTime = turnaroundTime - +process.burstTime;

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
    algorithmResult: fcfsResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

export default fcfsAlgorithm;
