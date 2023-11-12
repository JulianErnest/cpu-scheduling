import { AlgorithmResultData, TableData } from "../types";

const srtfAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  const sortedTableData = [...tableData];
  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  const srtfResult: AlgorithmResultData = {
    algorithmResult: [],
    averageTime: {
      turnaroundTime: 0,
      waitingTime: 0,
    },
  };

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

    if (selectedProcess.executionTime === +selectedProcess.burstTime) {
      const turnaroundTime = currentTime - +selectedProcess.arrivalTime;
      const waitingTime = turnaroundTime - +selectedProcess.burstTime;

      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;

      srtfResult.algorithmResult.push({
        ...selectedProcess,
        endTime: currentTime,
        turnaroundTime,
        waitingTime,
      });

      sortedTableData.splice(selectedProcessIndex, 1);
    }
  }

  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  srtfResult.averageTime.turnaroundTime = averageTurnaroundTime;
  srtfResult.averageTime.waitingTime = averageWaitingTime;

  return {
    algorithmResult: srtfResult.algorithmResult,
    averageTime: {
      turnaroundTime: srtfResult.averageTime.turnaroundTime,
      waitingTime: srtfResult.averageTime.waitingTime,
    },
  };
  
};

export default srtfAlgorithm;
