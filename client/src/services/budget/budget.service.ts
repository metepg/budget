import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({providedIn: 'root'})
export class BudgetService {
  private budgetUpdated = new BehaviorSubject<void>(undefined);
  budgetUpdated$ = this.budgetUpdated.asObservable();

  private selectedBudget = new BehaviorSubject<string>(this.getStoredBudget());
  selectedBudget$ = this.selectedBudget.asObservable();

  private apiUrl = environment.apiUrl + '/budget';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getCurrent(budgetType: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${budgetType}`);
  }

  notifyBudgetChange() {
    this.budgetUpdated.next();
  }

  setBudgetType(budgetType: string) {
    this.localStorageService.setSelectedBudget(budgetType);
    this.selectedBudget.next(budgetType);
    this.budgetUpdated.next();
  }

  getStoredBudget(): string {
    return this.localStorageService.getSelectedBudget() ?? 'week';
  }
}
