import { AlgorithmResultData, ChartData, TableData } from "../types";

const MLFQAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  const chartData: ChartData[] = [];
  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  const queues: TableData[][] = []; // Multiple priority queues
  const MLFQResult: AlgorithmResultData[] = [];

  // Initialize queues
  for (let i = 0; i < 3; i++) {
    queues.push([]);
  }

  while (tableData.length > 0) {
    const currentProcess = tableData.shift();

    if (!currentProcess) {
      currentTime++;
      continue;
    }

    const priority = determinePriority(currentProcess); 

    queues[priority].push(currentProcess);

    const executingProcess = queues.find((queue) => queue.length > 0)?.shift();

    if (executingProcess) {
      const burstTime = Math.min(1, executingProcess.burstTime);

      chartData.push({
        start: currentTime,
        end: currentTime + burstTime,
        id: executingProcess.id,
      });

      totalTurnaroundTime +=
        currentTime + burstTime - +executingProcess.arrivalTime;
      totalWaitingTime += currentTime - +executingProcess.arrivalTime;

      currentTime += burstTime;

      executingProcess.burstTime -= burstTime;

      if (executingProcess.burstTime > 0) {
        queues[priority + 1]?.push(executingProcess);
      } else {
        // Process completed, add to result
        MLFQResult.push({
          ...executingProcess,
          endTime: currentTime,
          turnaroundTime: currentTime - +executingProcess.arrivalTime,
          waitingTime:
            currentTime -
            +executingProcess.arrivalTime -
            +executingProcess.burstTime,
        });
      }
    }
  }

  const averageTurnaroundTime = totalTurnaroundTime / MLFQResult.length;
  const averageWaitingTime = totalWaitingTime / MLFQResult.length;

  return {
    algorithmResult: MLFQResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

const determinePriority = (process: TableData): number => {
  // Implement your logic to determine the priority of a process
  // You can consider factors like burst time, waiting time, etc.
  // For simplicity, I'm returning a constant priority in this example.
  return 0;
};

export default MLFQAlgorithm;

const determinePriority = (process: TableData): number => {
  const burstTime = process.burstTime;

  if (burstTime <= 5) {
    // High priority for short burst times
    return 0;
  } else if (burstTime <= 10) {
    // Medium priority for medium burst times
    return 1;
  } else {
    // Low priority for long burst times
    return 2;
  }
};
