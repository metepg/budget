import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Category } from '../../models/Category';

@Injectable({providedIn: 'root'})
export class CategoryService {
  private apiUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  saveCategories(categories: Category[]): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.apiUrl}`, categories);
  }
}
