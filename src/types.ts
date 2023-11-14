export type TableData = {
  id: number | string;
  arrivalTime: string | number;
  burstTime: number;
  timeQuantum?: number;
  queueLevel?: number;
  priority?: number| string;
  executionTime?: number;
};
export type AlgorithmResult = {
  id: number | string;
  arrivalTime: string | number;
  burstTime: string | number;
  endTime: number;
  turnaroundTime: number;
  queueLevel?: number;
  waitingTime: number;
  priority?: string | number;
};
export type AlgorithmResultData = {
  algorithmResult: AlgorithmResult[];
  averageTime: {
    turnaroundTime: number;
    waitingTime: number;
  };
  endTime?: number;
  ganttChartData: ChartData[];
  mlfqChartData?: {ql: number, data: ChartData[]}[];
};

export type ChartData = {
  id: number | string;
  start: number;
  end: number;
}