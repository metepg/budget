import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TestConnectionService {
  private apiUrl = '/api/test';

  constructor(private http: HttpClient) {
  }

  testConnection(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}`);
  }
}
