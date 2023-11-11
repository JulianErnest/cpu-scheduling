import { AlgorithmResultData, TableData } from "../types";

const fcfsAlgorithm = (tableData:TableData[]): AlgorithmResultData =>  {
  // Sort the processes based on arrival time
  
  const sortedTableData = [...tableData].sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime
  );

  let currentTime = 0;
  let endTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  const fcfsResult = sortedTableData.map((process) => {
    if (currentTime < +process.arrivalTime) {
      currentTime = +process.arrivalTime;
    }

    endTime = currentTime + +process.burstTime;
    const turnaroundTime = endTime - +process.arrivalTime;
    const waitingTime = turnaroundTime - +process.burstTime;

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
  }
};

export default fcfsAlgorithm;
