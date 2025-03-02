import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { MonthlyRecord } from '../../models/MonthlyRecord';

@Injectable({providedIn: 'root'})
export class IncomeService {
  private apiUrl = environment.apiUrl + '/incomes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MonthlyRecord[]> {
    return this.http.get<MonthlyRecord[]>(`${this.apiUrl}`);
  }

  getAllRecurring(): Observable<MonthlyRecord[]> {
    return this.http.get<MonthlyRecord[]>(`${this.apiUrl}/recurring`);
  }

  saveIncome(incomes: MonthlyRecord[]): Observable<MonthlyRecord[]> {
    return this.http.post<MonthlyRecord[]>(`${this.apiUrl}`, incomes);
  }

  removeIncome(income: MonthlyRecord): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${income.id}`);
  }

  getBill(id: number): Observable<MonthlyRecord> {
    return this.http.get<MonthlyRecord>(`${this.apiUrl}/${id}`);
  }

  deleteBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
