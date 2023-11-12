import { AlgorithmResultData, ChartData, TableData } from "../types";

const preemptivePriorityAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  const sortedTableData = [...tableData].sort(
    (a, b) => +a.arrivalTime - +b.arrivalTime
  );
  const chartData: ChartData[] = [];

  let currentTime = 0;
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  if (currentTime !== +sortedTableData[0].arrivalTime) {
    chartData.push({
      start: 0,
      end: +sortedTableData[0].arrivalTime,
      id: '-'
    });
    currentTime = +sortedTableData[0].arrivalTime;
  }

  const priorityResult: AlgorithmResultData[] = [];

  while (sortedTableData.length > 0) {
    let highestPriority = Infinity;
    let selectedProcessIndex = -1;

    for (let i = 0; i < sortedTableData.length; i++) {
      const process = sortedTableData[i];

      if (+process.arrivalTime <= currentTime) {
        if (process.priority < highestPriority) {
          highestPriority = process.priority;
          selectedProcessIndex = i;
        }
      }
    }

    if (selectedProcessIndex === -1) {
      currentTime++;
      continue;
    }

    const selectedProcess = sortedTableData[selectedProcessIndex];

    const remainingTime = +selectedProcess.burstTime - selectedProcess.executionTime || +selectedProcess.burstTime;

    const endTime = currentTime + 1;
    const turnaroundTime = endTime - +selectedProcess.arrivalTime;
    const waitingTime = turnaroundTime - +selectedProcess.burstTime;

    chartData.push({
      start: currentTime,
      end: endTime,
      id: selectedProcess.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    currentTime++;

    selectedProcess.executionTime++;

    if (selectedProcess.executionTime === +selectedProcess.burstTime) {
      priorityResult.push({
        ...selectedProcess,
        endTime,
        turnaroundTime,
        waitingTime,
      });

      sortedTableData.splice(selectedProcessIndex, 1);
    }
  }

  const averageTurnaroundTime = totalTurnaroundTime / tableData.length;
  const averageWaitingTime = totalWaitingTime / tableData.length;

  return {
    algorithmResult: priorityResult,
    averageTime: {
      turnaroundTime: averageTurnaroundTime,
      waitingTime: averageWaitingTime,
    },
    ganttChartData: chartData,
  };
};

export default preemptivePriorityAlgorithm;