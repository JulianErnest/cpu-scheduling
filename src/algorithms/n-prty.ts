import { AlgorithmResultData, ChartData, TableData } from "../types";

const nonPreemptivePriorityAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
  // Initialize executionTime to 0 for each row at the start
  const initializedTableData = tableData.map(row => ({ ...row, executionTime: 0 }));

  const sortedTableData = [...initializedTableData].sort(
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
    const eligibleProcesses = sortedTableData.filter(process => +process.arrivalTime <= currentTime);

    if (eligibleProcesses.length === 0) {
      currentTime++;
      console.log("No eligible process. Current time:", currentTime);
      continue;
    }

    // Find the process with the highest priority
    const selectedProcess = eligibleProcesses.reduce((prev, current) =>
      current.priority < prev.priority ? current : prev
    );

    const endTime = currentTime + +selectedProcess.burstTime;
    const turnaroundTime = endTime - +selectedProcess.arrivalTime;
    const waitingTime = turnaroundTime - +selectedProcess.burstTime;

    chartData.push({
      start: currentTime,
      end: endTime,
      id: selectedProcess.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    currentTime = endTime;

    priorityResult.push({
      ...selectedProcess,
      endTime,
      turnaroundTime,
      waitingTime,
    });

    // Remove the processed process from the list
    const processIndex = sortedTableData.findIndex(process => process.id === selectedProcess.id);
    sortedTableData.splice(processIndex, 1);
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

export default nonPreemptivePriorityAlgorithm
