import { AlgorithmResultData, TableData } from "../types";

const sjfAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  const processes = [...tableData];

  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  const sjfResult: AlgorithmResultData[] = [];

  while (processes.length > 0) {
    let minIndex = -1;
    let minBurstTime = Number.MAX_VALUE;

    for (let i = 0; i < processes.length; i++) {
      if (+processes[i].arrivalTime <= currentTime && +processes[i].burstTime < minBurstTime) {
        minIndex = i;
        minBurstTime = +processes[i].burstTime;
      }
    }

    if (minIndex === -1) {
      // No available processes, move time forward
      currentTime++;
    } else {
      const selectedProcess = processes[minIndex];
      const waitingTime = currentTime - +selectedProcess.arrivalTime;
      const turnaroundTime = waitingTime + +selectedProcess.burstTime;

      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;

      sjfResult.push({
        ...selectedProcess,
        endTime: currentTime + +selectedProcess.burstTime,
        waitingTime,
        turnaroundTime,
      });

      currentTime += +selectedProcess.burstTime;
      processes.splice(minIndex, 1);
    }
  }

  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  return {
    algorithmResult: sjfResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
  };
};

export default sjfAlgorithm;
