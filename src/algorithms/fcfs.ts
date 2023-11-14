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

    currentTime = endTime;

    return {
      ...process,
      endTime,
      turnaroundTime,
      waitingTime,
    };
  });

  return {
    algorithmResult: fcfsResult,
    averageTime: {
        turnaroundTime: fcfsResult.reduce((acc, curr) => acc + curr.turnaroundTime, 0) / fcfsResult.length,
        waitingTime: fcfsResult.reduce((acc, curr) => acc + curr.waitingTime, 0) / fcfsResult.length,
    },
    ganttChartData: chartData,
  };
};

export default fcfsAlgorithm;
