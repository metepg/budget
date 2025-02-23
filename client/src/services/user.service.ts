import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/User';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  saveUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}