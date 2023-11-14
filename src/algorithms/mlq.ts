import { AlgorithmResultData, TableData } from "../types";

const mlqAlgorithm = (queues: TableData[]): AlgorithmResultData => {
console.log(queues);
   return {
    algorithmResult: [
        { id: 'P1', arrivalTime: 3, burstTime: 4, priority: 2, queueLevel: 1, endTime: 7, turnaroundTime: 4, waitingTime: 0 },
        { id: 'P2', arrivalTime: 5, burstTime: 9, priority: 1, queueLevel: 1, endTime: 16, turnaroundTime: 11, waitingTime: 2 },
        { id: 'P3', arrivalTime: 8, burstTime: 4, priority: 2, queueLevel: 2, endTime: 30, turnaroundTime: 22, waitingTime: 18 },
        { id: 'P4', arrivalTime: 0, burstTime: 7, priority: 1, queueLevel: 2, endTime: 26, turnaroundTime: 26, waitingTime: 19 },
        { id: 'P5', arrivalTime: 12, burstTime: 6, priority: 1, queueLevel: 1, endTime: 22, turnaroundTime: 22, waitingTime: 4 },
    ],
    averageTime: {
      turnaroundTime: 14.60, 
      waitingTime: 8.60,  
    },
    ganttChartData: [
        {start: 0, end: 2, id: 'P4'},
        {start: 3, end: 6, id: 'P1'},
        {start: 7, end: 15, id: 'P2'},
        {start: 16, end: 21, id: 'P3'},
        {start: 22, end: 25, id: 'P4'},
        {start: 26, end: 30, id: 'P3'},
    ],   
  };
};

export default mlqAlgorithm;
