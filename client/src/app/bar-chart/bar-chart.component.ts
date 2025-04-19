import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { generateChartData, generateYearOptions } from '../../utils/chartUtils';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { BAR_CHART_OPTIONS } from '../../constants/constants';
import { ChartData } from 'chart.js';
import { Bill } from '../../models/Bill';
import { BillService } from '../../services/bill/bill.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { UIChart } from 'primeng/chart';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  imports: [
    DropdownModule,
    FormsModule,
    AsyncPipe,
    UIChart,
    ProgressSpinner,
    Select
  ],
  standalone: true
})
export class BarChartComponent implements OnInit {
  protected readonly STACKED_OPTIONS = BAR_CHART_OPTIONS;
  yearOptions = signal<{ name: string, code: number }[]>([]);
  selectedYear = signal<number>(new Date().getFullYear());
  data = signal<ChartData | null>(null);
  monthlyValuesByCategory = signal<Map<string, number[]>>(new Map());
  bills$!: Observable<Bill[]>;
  @Input() showSideBar = signal<boolean>(false);
  @Output() showSideBarChange = new EventEmitter<boolean>();


  constructor(private billService: BillService, private categoryService: CategoryService) {
  }

  onChange(event: DropdownChangeEvent): void {
    this.getStatistics(event.value);
  }

  ngOnInit(): void {
    this.yearOptions.set(generateYearOptions(5));
    this.getStatistics(this.selectedYear());
  }

  /**
   * Fetches bills for a given year, processes them to aggregate monthly values by category,
   * and updates the component's state with the new data.
   *
   * @param year - The year for which to fetch and process bill data.
   */
  getStatistics(year: number): void {
    this.bills$ = forkJoin([
      this.categoryService.getAll(),
      this.billService.getBillsByYear(year)
    ]).pipe(
      tap(([categories, bills]) => {
        const monthlyValuesByCategory = this.aggregateMonthlyValues(bills);
        this.monthlyValuesByCategory.set(new Map(monthlyValuesByCategory));
        this.data.set(generateChartData(monthlyValuesByCategory, categories));
      }),
      map(([, bills]) => bills)
    );
  }

  /**
   * Aggregates monthly values by category from a list of bills.
   *
   * @param bills - The list of bills to process.
   * @returns A map where each key is a category and the value is an array of monthly amounts.
   *
   * Example:
   * ```typescript
   * {
   *   "Category1": [
   *     494.35, // January
   *     298.83, // February
   *     265.46, // March
   *     445.57,
   *     155.81,
   *     82.14,
   *     2,
   *     500,
   *     42,
   *     592.55,
   *     212.3,
   *     12.32
   *   ], etc..
   * }
   * ```
   */
  private aggregateMonthlyValues(bills: Bill[]): Map<string, number[]> {
    const monthlyValuesByCategory = new Map<string, number[]>();

    for (const { date, category, amount } of bills) {
      const month = new Date(date).getMonth();
      const key = category.description;
      const arr = monthlyValuesByCategory.get(key) ?? new Array(12).fill(0);
      arr[month] += amount;
      monthlyValuesByCategory.set(key, arr);
    }

    return monthlyValuesByCategory;
  }

}
