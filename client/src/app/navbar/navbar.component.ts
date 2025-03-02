import { Component, OnInit } from '@angular/core';
import { View } from '../../constants/View';
import { Button } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { BehaviorSubject, merge, Observable, startWith, switchMap } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [ToastModule, ToolbarModule, Button, DecimalPipe, NgIf, AsyncPipe]
})

export class NavbarComponent implements OnInit {
  private selectedBudget$ = new BehaviorSubject<string | null>(null);
  currentBudget$: Observable<number>;

  private routeMap = {
    [View.NEW_BILL]: 'bills/new',
    [View.SHOW_BILLS]: 'bills',
    [View.SHOW_STATISTICS]: 'stats',
    [View.SHOW_PROFILE]: 'profile'
  };

  constructor(
    private router: Router,
    private budgetService: BudgetService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const storedBudget: string = this.localStorageService.getSelectedBudget() ?? 'week';
    this.selectedBudget$.next(storedBudget);

    this.currentBudget$ = merge(
      this.budgetService.budgetUpdated$,
      this.selectedBudget$
    ).pipe(
      startWith(this.localStorageService.getSelectedBudget() ?? 'week'),
      switchMap(() => {
        const selectedBudget = this.localStorageService.getSelectedBudget() ?? 'week';
        return this.budgetService.getCurrent(selectedBudget);
      })
    );
  }

  showTab(view: View) {
    const route = this.routeMap[view] || '';
    console.log('navigate to', route);
    this.router.navigate([route]);
  }

  protected readonly View = View;
}
