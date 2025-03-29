import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Bill } from '../../models/Bill';

@Injectable({providedIn: 'root'})
export class BillService {
  private apiUrl = environment.apiUrl + '/bills';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}`);
  }

  getAllRecurring(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/recurring`);
  }

  getAllNotRecurring(month: number | null): Observable<Bill[]> {
    const params = month ? `?month=${month}` : '';
    return this.http.get<Bill[]>(`${this.apiUrl}/not-recurring${params}`);
  }

  saveIncome(incomes: Bill[]): Observable<Bill[]> {
    return this.http.post<Bill[]>(`${this.apiUrl}`, incomes);
  }

  removeIncome(income: Bill): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${income.id}`);
  }

  getBill(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${id}`);
  }

  deleteBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
