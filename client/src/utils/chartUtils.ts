import { ChartData } from 'chart.js';
import { MONTHS } from '../constants/constants';
import { Category } from '../models/Category';

/**
 * Generates an array of year options going back a specified number of years from the current year.
 * 
 * @param yearsToGoBack - The number of years to generate options for, counting back from the current year.
 * @returns An array of objects.
 * 
 * Example:
 * ```typescript
 * [
 *   { code: 2024, name: "2024" },
 *   { code: 2023, name: "2023" },
 *   { code: 2022, name: "2022" },
 *   // ...
 * ]
 * ```
 */
export function generateYearOptions(yearsToGoBack: number): { name: string, code: number }[] {
  const currentYear = new Date().getFullYear();
  return Array.from({length: yearsToGoBack}, (_, idx) => {
    const year = currentYear - idx;
    return {name: year.toString(), code: year};
  });
}

/**
 * Generates chart data from the provided map of monthly values by category.
 *
 * @param data - The map containing monthly values by category.
 * @param categories
 * @returns A ChartData object structured for charting.
 */
export function generateChartData(data: Map<string, number[]>, categories: Category[]): ChartData {
  return {
    labels: MONTHS,
    datasets: categories.map((category) => ({
      label: category.description,
      backgroundColor: category.color,
      data: data.get(category.description) || new Array(MONTHS.length).fill(0) as number[],
    })),
  };
}
