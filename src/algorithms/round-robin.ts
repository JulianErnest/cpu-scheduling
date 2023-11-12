import { AlgorithmResultData, ChartData, TableData } from "../types";

const roundRobinAlgorithm = (tableData: TableData[], timeQuantum: number): AlgorithmResultData => {
  // Initialize executionTime to 0 for each row at the start
  const initializedTableData = tableData.map(row => ({ ...row, executionTime: 0 }));

  const chartData: ChartData[] = [];
  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  const queue: TableData[] = [...initializedTableData];
  const roundRobinResult: AlgorithmResultData[] = [];

  while (queue.length > 0) {
    const currentProcess = queue.shift();

    if (!currentProcess) {
      currentTime++;
      console.log("Queue is empty. Current time:", currentTime);
      continue;
    }

    const remainingTime = +currentProcess.burstTime - currentProcess.executionTime;
    const executeTime = Math.min(remainingTime, timeQuantum);

    const endTime = currentTime + executeTime;
    const turnaroundTime = endTime - +currentProcess.arrivalTime;
    const waitingTime = turnaroundTime - +currentProcess.burstTime;

    chartData.push({
      start: currentTime,
      end: endTime,
      id: currentProcess.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    currentTime = endTime;

    currentProcess.executionTime += executeTime;

    if (currentProcess.executionTime < +currentProcess.burstTime) {
      // If the process is not completed, push it back to the queue
      queue.push(currentProcess);
    } else {
      // Process completed, add to result
      roundRobinResult.push({
        ...currentProcess,
        endTime,
        turnaroundTime,
        waitingTime,
      });
    }
  }

  console.log(chartData);
  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  return {
    algorithmResult: roundRobinResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

export default roundRobinAlgorithm;
