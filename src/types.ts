export type TableData = {
  id: number | string;
  arrivalTime: string;
  burstTime: string;
  timeQuantum?: number;
  priority?: number;
};
export type AlgorithmResult = {
  endTime: number;
  turnaroundTime: number;
  waitingTime: number;
  id: number | string;
  arrivalTime: string;
  burstTime: string;
};
export type AlgorithmResultData = {
  algorithmResult: AlgorithmResult[];
  averageTime: {
    turnaroundTime: number;
    waitingTime: number;
  };
};
