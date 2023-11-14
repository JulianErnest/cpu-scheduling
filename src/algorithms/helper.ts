// @ts-nocheck
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

export function deepCopy(obj: never) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      const newArray = [];
      for (let i = 0; i < obj.length; i++) {
        newArray[i] = deepCopy(obj[i]);
      }
      return newArray;
    }
  }

export  function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
}