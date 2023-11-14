// @ts-nocheck
import { AlgorithmResult, AlgorithmResultData, ChartData, TableData } from "../types";
import { deepCopy} from "./helper";

const roundRobinAlgorithm = (tableData: TableData[], timeQuantum: number): AlgorithmResultData => {
    console.log(tableData)
    /*
    1. Sort tablleData by arrival time 
    2. Create readyQueue
    3. While total burst time is not 0
    4. If readyQueue is empty, push first process to readyQueue
    5. 
    */
    // Clone tableData
    const cloneTableData = deepCopy(tableData) as TableData[];
    cloneTableData.sort((a, b) => +a.arrivalTime - +b.arrivalTime);
    console.log(cloneTableData);
    let currentTime = +cloneTableData[0].arrivalTime; 
    const readyQueue: TableData[] = [];
    const ganttChartData: ChartData[] = [];
    const algorithmResult: AlgorithmResult[] = cloneTableData.map((item) => 
    ({  ...item, endTime: 0, turnaroundTime: 0, waitingTime: 0 }));

    if (+cloneTableData[0].arrivalTime !== 0) {
        ganttChartData.push({
            id: "-",
            start: 0,
            end: +cloneTableData[0].arrivalTime,
        });
    }

    readyQueue.push(cloneTableData[0]);

    console.log(readyQueue);

    // while total burst time is not 0
    let allBurst = cloneTableData.reduce((acc, curr) => +acc + +curr.burstTime, 0);

    while (allBurst !== 0) {
        let timeMove = 0;
        console.log(readyQueue.length);
        if (readyQueue[0] == null) {
            // Find next arrival time based on current time
            const nextArrivalTime = cloneTableData.find((item) => +item.arrivalTime > currentTime)?.arrivalTime;
            // If idle time add to current time without going past next arrival time
            if (nextArrivalTime) {
                timeMove = Math.min(timeQuantum, +nextArrivalTime - currentTime);
            }
        } else {
            timeMove = Math.min(timeQuantum, readyQueue[0].burstTime);
        }
        const index = cloneTableData.findIndex((item) => item.id === readyQueue[0]?.id);
        if (index != -1) {
            const newBurstTime = cloneTableData[index].burstTime - timeMove;
            cloneTableData[index].burstTime = newBurstTime;
            readyQueue[0].burstTime = newBurstTime;
        }
        ganttChartData.push({
            id: readyQueue[0]?.id ?? '-',
            start: currentTime,
            end: currentTime + timeMove,
        })
        currentTime  += timeMove;
        // Push into readyQueue if arrival time is less than current time
        for (let i = 0; i < cloneTableData.length; i++) {
            // If already in readyQueue, skip
            if (cloneTableData[i].burstTime === 0 || readyQueue.find((item) => item.id === cloneTableData[i].id)) {
                continue;
            }
            if (+cloneTableData[i].arrivalTime <= currentTime) {
                readyQueue.push(cloneTableData[i]);
            }
        }
        const shifted = readyQueue.shift();
        console.log('shifted', shifted, currentTime, timeMove);
        if (shifted?.burstTime !== 0) {
            shifted && readyQueue.push(shifted);
        } else {
            const index = algorithmResult.findIndex((item) => item.id === shifted?.id);
            algorithmResult[index].endTime = currentTime;
            algorithmResult[index].turnaroundTime = algorithmResult[index].endTime - +algorithmResult[index]?.arrivalTime;
            algorithmResult[index].waitingTime = algorithmResult[index].turnaroundTime - +algorithmResult[index]?.burstTime;
        }
        allBurst = cloneTableData.reduce((acc, curr) => acc + +curr.burstTime, 0);
    }

    console.log(ganttChartData)

    return {
        algorithmResult,
        averageTime: {
            turnaroundTime: algorithmResult.reduce((acc, curr) => acc + curr.turnaroundTime, 0) / algorithmResult.length,
            waitingTime: algorithmResult.reduce((acc, curr) => acc + curr.waitingTime, 0) / algorithmResult.length,
        },
        ganttChartData: ganttChartData,
    }

};

export default roundRobinAlgorithm;
