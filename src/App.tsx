import { useEffect, useState } from "react";
import "./App.css";
import fcfsAlgorithm from "./algorithms/fcfs";
import { AlgorithmResultData, TableData } from "./types";
import sjfAlgorithm from "./algorithms/sjf";
import srtfAlgorithm from "./algorithms/srtf";

const SchedulingAlgorithms = [
  { label: "First Come First Serve", value: "fcfs" },
  { label: "Multilevel Feedback Queue", value: "mlfq" },
  { label: "Multilevel Queue", value: "mlq" },
  { label: "Priority Based Scheduling", value: "prty" },
  { label: "Priority Non Preemptive", value: "n-prty" },
  { label: "Round-Robin Scheduling", value: "round-robin" },
  { label: "Shortest Job First", value: "sjf" },
  { label: "Shortest Remaining Time First", value: "srtf" },
];

function App() {
  const [tableData, setTableData] = useState<TableData[]>([
    { id: "P1", arrivalTime: "", burstTime: "" },
    { id: "P2", arrivalTime: "", burstTime: "" },
    { id: "P3", arrivalTime: "", burstTime: "" },
  ]);
  const [resultData, setResultData] = useState<AlgorithmResultData>({
    algorithmResult: [],
    averageTime: {
      turnaroundTime: 0,
      waitingTime: 0,
    },
    ganttChartData: [],
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(0);

  const addRow = () => {
    const newRow = {
      id: "P" + (tableData.length + 1),
      arrivalTime: "",
      burstTime: "",
    } as TableData;
    setTableData([...tableData, newRow]);
  };

  const removeRow = (id: number | string) => {
    const updatedData = tableData.filter((row) => row.id !== id);
    setTableData(updatedData);
  };

  const handleArrivalTimeChange = (id: number | string, value: string) => {
    const updatedData = [...tableData];
    const targetRow = updatedData.find((item) => item.id === id);
    if (targetRow) {
      targetRow.arrivalTime = value;
      setTableData(updatedData);
    }
  };

  const handleBurstTimeChange = (id: number | string, value: string) => {
    const updatedData = [...tableData];
    const targetRow = updatedData.find((item) => item.id === id);
    console.log(targetRow)
    if (targetRow) {
      targetRow.burstTime = value;
      setTableData(updatedData);
    }
  };

  const solve = () => {
    console.log(tableData);
    switch (selectedAlgorithm) {
      case "fcfs":
        setResultData(fcfsAlgorithm(tableData));
        break;
      // Add cases for other algorithms
      case "sjf":
        setResultData(sjfAlgorithm(tableData));
        break;
      case "srtf":
        setResultData(srtfAlgorithm(tableData));
        break;
      default:
        console.error("Unknown algorithm");
    }
  };

  const handlePriorityChange = (id: number | string, value: number) => {
    const updatedData = [...tableData];
    const targetRow = updatedData.find((item) => item.id === id);
    if (targetRow) {
      targetRow.priority = value;
      setTableData(updatedData);
    }
  };

  useEffect(() => {
    if (selectedAlgorithm === "prty" || selectedAlgorithm === "n-prty") {
      // setTableData());
      // setTableData((row) => ({ ...row, priority: "" }));

      const newTableData = tableData.map((row) => ({ ...row, priority: 0 }));
      setTableData(newTableData);
    } else {
      const newTableData = tableData.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ priority, ...keepAttrs }) => keepAttrs
      );
      console.log(newTableData);
      setTableData(newTableData);
    }
  }, [selectedAlgorithm]);

  return (
    <>
      <div className="grid grid-cols-12 p-8 gap-x-8 h-screen w-screen bg-[#242424]">
        <div className="flex justify-center p-4 col-span-5 rounded-md bg-[#363636]">
          <div className="col-span-4 w-full rounded-md bg-[#363636] py-4">
            <label className="block text-white text-sm font-semibold mb-2">
              <h2 className="text-3xl">Select an algorithm</h2>
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(val) => setSelectedAlgorithm(val.target.value)}
              className="w-full bg-[#474747] border mt-4 border-gray-600 rounded-md p-2 text-white"
            >
              {SchedulingAlgorithms.map((algorithm, index) => (
                <option key={index} value={algorithm.value}>
                  {algorithm.label}
                </option>
              ))}
            </select>
            {selectedAlgorithm === "round-robin" && (
              <>
                <label className="block text-white text-sm font-semibold mt-6 mb-2">
                  <h2 className="text-3xl">Time Quantum</h2>
                </label>
                <input
                  value={timeQuantum}
                  type="number"
                  onChange={(e) => setTimeQuantum(+e.target.value)}
                  className="w-full bg-[#474747] border mt-4 border-gray-600 rounded-md p-2 text-white"
                />
              </>
            )}

            <div
              className="col-span-1 mt-8 rounded-md bg-[#363636] p-4 overflow-y-scroll"
              style={{ maxHeight: "800px" }}
            >
              <table className="table-auto max-w-full text-white">
                <thead>
                  <tr>
                    <th>Process ID</th>
                    <th>Arrival Time</th>
                    <th>Burst Time</th>
                    {(selectedAlgorithm === "prty" ||
                      selectedAlgorithm === "n-prty") && <th>Priority</th>}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="mt-8">
                      <td>
                        <input
                          className="text-center"
                          type="text"
                          value={row.id}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="text-center"
                          value={row.arrivalTime}
                          onChange={(e) =>
                            handleArrivalTimeChange(row.id, e.target.value)
                          }
                        />
                      </td>
                      {(selectedAlgorithm === "n-prty" ||
                        selectedAlgorithm === "prty") && (
                        <td>
                          <input
                            className="text-center"
                            type="text"
                            value={row.priority}
                            onChange={(e) =>
                              handlePriorityChange(row.id, +e.target.value)
                            }
                          />
                        </td>
                      )}

                      <td>
                        <input
                          className="text-center"
                          type="text"
                          value={row.priority}
                          onChange={(e) =>
                            handleBurstTimeChange(row.id, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button onClick={() => removeRow(row.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="mt-4 bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-4 rounded"
                onClick={addRow}
              >
                Add Row
              </button>
              <div className="mt-4">
                <button
                  className="bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-4 rounded mr-4"
                  onClick={solve}
                >
                  Solve
                </button>
                {/* Add buttons for other algorithms */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-7 py-8 px-4 ounded-md bg-[#121212]">
          <h2 className="text-3xl font-semibold">Output</h2>
          <table className="table-auto max-w-full text-white border border-collapse border-gray-600 mt-8">
            <thead>
              <tr className="bg-[#4CAF50] text-white">
                <th className="py-2 px-4">Job</th>
                <th className="py-2 px-4">Arrival Time</th>
                {(selectedAlgorithm === "prty" ||
                  selectedAlgorithm === "n-prty") && <th>Priority</th>}
                <th className="py-2 px-4">Burst Time</th>
                <th className="py-2 px-4">End Time</th>
                <th className="py-2 px-4">Turnaround Time</th>
                <th className="py-2 px-4">Waiting Time</th>
              </tr>
            </thead>
            <tbody>
              {resultData.algorithmResult?.map((result) => (
                <tr key={result.id} className="border-t border-gray-600">
                  <td className="py-2 px-4 text-center">{result.id}</td>
                  <td className="py-2 px-4 text-center">
                    {result.arrivalTime}
                  </td>
                  <td className="py-2 px-4 text-center">{result.burstTime}</td>
                  <td className="py-2 px-4 text-center">{result.endTime}</td>
                  <td className="py-2 px-4 text-center">
                    {result.turnaroundTime}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {result.waitingTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {resultData.ganttChartData.length > 0 && (
            <h2 className="text-3xl font-semibold my-8">Gantt Chart</h2>
          )}
          <div className="flex flex-row flex-wrap gap-y-8">
            {resultData.ganttChartData.map((operation, index) => (
              <div
                className="relative flex items-center justify-center h-8 bg-[#4CAF50] border-solid border-2"
                style={{
                  width: `${
                    Math.max(20, operation.end - operation.start) * 5
                  }px`,
                }}
              >
                <h3>{operation.id}</h3>
                {index === resultData.ganttChartData.length - 1 && (
                  <h2 className="absolute -right-2 -bottom-6 text-xl">
                    {operation.end}
                  </h2>
                )}
                <h2 className="absolute -left-1 -bottom-6 text-xl">
                  {operation.start}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
