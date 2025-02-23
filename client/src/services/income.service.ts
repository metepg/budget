import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Income } from '../models/Income';

@Injectable({providedIn: 'root'})
export class IncomeService {
  private apiUrl = environment.apiUrl + '/incomes';

  constructor(private http: HttpClient) {}

  saveIncome(income: Income): Observable<Income> {
    console.log("hes")
    return this.http.post<Income>(`${this.apiUrl}`, income);
  }
}
