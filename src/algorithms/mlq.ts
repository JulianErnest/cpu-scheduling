import { AlgorithmResultData, ChartData, TableData } from "../types";

const determinePriority = (process: TableData): number => {
  return 1 / process.burstTime;
};

const mlqAlgorithm = (queues: TableData[][]): AlgorithmResultData => {
  const chartData: ChartData[] = [];
  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;
  const mlqResult: AlgorithmResultData[] = [];

  for (const queue of queues) {
    const queueResult = applySchedulingAlgorithm(queue, determinePriority);

    chartData.push(...queueResult.ganttChartData);
    totalTurnaroundTime += queueResult.averageTime.turnaroundTime;
    totalWaitingTime += queueResult.averageTime.waitingTime;

    mlqResult.push(queueResult);
  }

  const averageTurnaroundTime = totalTurnaroundTime / mlqResult.length;
  const averageWaitingTime = totalWaitingTime / mlqResult.length;

  return {
    algorithmResult: mlqResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

const applySchedulingAlgorithm = (
  queue: TableData[],
  priorityFunction: (process: TableData) => number
): AlgorithmResultData => {
  const sortedQueue = [...queue].sort((a, b) => priorityFunction(b) - priorityFunction(a));

  return {
    algorithmResult: sortedQueue.map((process) => ({
      ...process,
      endTime: currentTime + process.burstTime,
      turnaroundTime: currentTime + process.burstTime - process.arrivalTime,
      waitingTime: currentTime - process.arrivalTime,
    })),
    averageTime: {
      turnaroundTime: 0, 
      waitingTime: 0,  
    },
    ganttChartData: [],   
  };
};

export default mlqAlgorithm;
