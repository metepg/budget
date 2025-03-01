import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { MonthlyRecord } from '../../models/MonthlyRecord';

@Injectable({providedIn: 'root'})
export class IncomeService {
  private apiUrl = environment.apiUrl + '/incomes';

  constructor(private http: HttpClient) {}

  getAll(username: string): Observable<MonthlyRecord[]> {
    return this.http.get<MonthlyRecord[]>(`${this.apiUrl}?username=${username}`);
  }

  saveIncome(incomes: MonthlyRecord[]): Observable<MonthlyRecord[]> {
    return this.http.post<MonthlyRecord[]>(`${this.apiUrl}`, incomes);
  }
}
