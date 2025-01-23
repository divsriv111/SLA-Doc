import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getCurrentUser().subscribe();
  }

  getCurrentUser() {
    return this.http.get(`${this.apiUrl}/auth/user`, { withCredentials: true }).pipe(
      tap({
        next: (user) => {
          console.log('success api', user);
          this.isAuthenticatedSubject.next(!!user)},
        error: () => {console.log('error api'); this.isAuthenticatedSubject.next(false)}
      })
    );
  }

  signup(credentials: {email: string, password: string}) {
    return this.http.post(`${this.apiUrl}/auth/signup`, credentials, {
      withCredentials: true 
    });
  }

  login(credentials: {email: string, password: string}) {
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials, {
      withCredentials: true 
    }).pipe(
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/signout`, {}, {
      withCredentials: true 
    }).pipe(
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }
}