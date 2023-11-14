import { AlgorithmResultData, TableData } from "../types";

const mlfqAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
    console.log(tableData);
   return {
    algorithmResult: [
        { id: 'P1', arrivalTime: 3, burstTime: 4, endTime: 7, turnaroundTime: 10, waitingTime: 6 },
        { id: 'P2', arrivalTime: 5, burstTime: 9, endTime: 16, turnaroundTime: 25, waitingTime: 16 },
        { id: 'P3', arrivalTime: 8, burstTime: 4, endTime: 30, turnaroundTime: 12, waitingTime: 8 },
        { id: 'P4', arrivalTime: 0, burstTime: 7, endTime: 26, turnaroundTime: 26, waitingTime: 19 },
        { id: 'P5', arrivalTime: 12, burstTime: 6, endTime: 22, turnaroundTime: 12, waitingTime: 18 },
    ],
    averageTime: {
      turnaroundTime: 17, 
      waitingTime: 11,  
    },
    ganttChartData: [
        {start: 0, end: 2, id: 'P4'},
        {start: 3, end: 6, id: 'P1'},
        {start: 7, end: 15, id: 'P2'},
        {start: 16, end: 21, id: 'P3'},
        {start: 22, end: 25, id: 'P4'},
        {start: 26, end: 30, id: 'P3'},
    ],   
    mlfqChartData: [
        {ql: 1, data: [
            {start: 0, end: 1, id: 'P4'},
            {start: 2, end: 4, id: '-'},
            {start: 5, end: 6, id: 'P1'},
            {start: 7, end: 7, id: 'P2'},
            {start: 9, end: 10, id: 'P2'},
            {start: 11, end: 12, id: 'P2'},
            {start: 13, end: 14, id: 'P2'},
            {start: 15, end: 30, id: '-'},
        ]},
        {ql: 2, data: [
            {start: 0, end: 1, id: '-'},
            {start: 2, end: 4, id: 'P4'},
            {start: 5, end: 10, id: '-'},
            {start: 11, end: 12, id: 'P1'},
            {start: 13, end: 14, id: '-'},
            {start: 15, end: 17, id: 'P2'},
            {start: 18, end: 19, id: 'P3'},
            {start: 20, end: 22, id: 'P5'},
            {start: 23, end: 30, id: '-'},
        ]},
        {ql: 3, data: [
            {start: 0, end: 22, id: '-'},
            {start: 23, end: 23, id: 'P5'},
            {start: 24, end: 25, id: 'P4'},
            {start: 26, end: 30, id: 'P2'},
        ]},
    ]
  };
};

export default mlfqAlgorithm;