import { ChartData } from "../types";

export function formatChartData(chartData: ChartData[]) {
    const mergedData = chartData.reduce((merged: ChartData[], item) => {
      const lastItem = merged[merged.length - 1] as ChartData;
    
      if (lastItem && lastItem.id === item.id) {
        // Merge consecutive items with the same id
        lastItem.end = item.end;
      } else {
        // Add a new item to the merged array
        merged.push({ ...item });
      }
    
      return merged;
    }, []);
    return mergedData;
  }