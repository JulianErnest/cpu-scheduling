import { AlgorithmResultData, ChartData, TableData } from "../types";

const srtfAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  // Sort the processes based on arrival time
  const sortedTableData = [...tableData].sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime
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

  const srtfResult: AlgorithmResultData[] = [];

  while (sortedTableData.length > 0) {
    // Find the process with the shortest remaining time
    let shortestRemainingTime = Infinity;
    let selectedProcessIndex = -1;

    for (let i = 0; i < sortedTableData.length; i++) {
      const process = sortedTableData[i];

      if (+process.arrivalTime <= currentTime) {
        const remainingTime = +process.burstTime - process.executionTime || +process.burstTime;

        if (remainingTime < shortestRemainingTime) {
          shortestRemainingTime = remainingTime;
          selectedProcessIndex = i;
        }
      }
    }

    if (selectedProcessIndex === -1) {
      currentTime++;
      continue;
    }

    const selectedProcess = sortedTableData[selectedProcessIndex];
    if (!selectedProcess.executionTime) {
      selectedProcess.executionTime = 0;
    }

    currentTime++;
    selectedProcess.executionTime++;

    const endTime = currentTime;
    const turnaroundTime = endTime - +selectedProcess.arrivalTime;
    const waitingTime = turnaroundTime - +selectedProcess.burstTime;

    chartData.push({
      start: currentTime - selectedProcess.executionTime,
      end: endTime,
      id: selectedProcess.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    if (selectedProcess.executionTime === +selectedProcess.burstTime) {
      srtfResult.push({
        ...selectedProcess,
        endTime,
        turnaroundTime,
        waitingTime,
      });

      sortedTableData.splice(selectedProcessIndex, 1);
    }
  }

  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  return {
    algorithmResult: srtfResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

export default srtfAlgorithm;
