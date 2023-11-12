import { AlgorithmResultData, ChartData, TableData } from "../types";

const preemptivePriorityAlgorithm = (tableData: TableData[]): AlgorithmResultData => {
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
    let highestPriority = Infinity;
    let selectedProcessIndex = -1;

    for (let i = 0; i < sortedTableData.length; i++) {
      const process = sortedTableData[i];

      if (+process.arrivalTime <= currentTime && process.priority < highestPriority) {
        highestPriority = process.priority;
        selectedProcessIndex = i;
      }
    }

    if (selectedProcessIndex === -1) {
      currentTime++;
      console.log("No process selected. Current time:", currentTime);
      continue;
    }

    const selectedProcess = sortedTableData[selectedProcessIndex];
    const remainingTime = +selectedProcess.burstTime - selectedProcess.executionTime;

    console.log("Selected process:", selectedProcess);
    console.log("Remaining time:", remainingTime);

    // Ensure timeToExecute is positive and non-zero
    const timeToExecute = Math.max(Math.min(remainingTime, 1), 0);

    console.log("Time to execute:", timeToExecute);

    const endTime = currentTime + timeToExecute;
    const turnaroundTime = endTime - +selectedProcess.arrivalTime;
    const waitingTime = turnaroundTime - +selectedProcess.burstTime;

    console.log("End time:", endTime);
    console.log("Turnaround time:", turnaroundTime);
    console.log("Waiting time:", waitingTime);

    chartData.push({
      start: currentTime,
      end: endTime,
      id: selectedProcess.id,
    });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    currentTime = endTime;

    selectedProcess.executionTime += timeToExecute;

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
