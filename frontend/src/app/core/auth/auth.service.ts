import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';  

  constructor(private http: HttpClient) {}

  signup(credentials: {email: string, password: string}) {
    return this.http.post(`${this.apiUrl}/auth/signup`, credentials, {
      withCredentials: true 
    });
  }

  login(credentials: {email: string, password: string}) {
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials, {
      withCredentials: true 
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/signout`, {
      withCredentials: true 
    });
  }
}