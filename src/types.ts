export type TableData = {
  id: number | string;
  arrivalTime: string;
  burstTime: string;
  timeQuantum?: number;
  priority?: number| string;
  executionTime?: number;
};
export type AlgorithmResult = {
  endTime: number;
  turnaroundTime: number;
  waitingTime: number;
  id: number | string;
  arrivalTime: string;
  burstTime: string | number;
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
};

export type ChartData = {
  id: number | string;
  start: number;
  end: number;
}