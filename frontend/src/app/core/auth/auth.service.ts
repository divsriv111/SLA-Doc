import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    } else {
      this.loadingSubject.next(false);
    }
  }

  private checkAuthStatus(): void {
    this.getCurrentUser().pipe(
      catchError(() => of(null))
    ).subscribe({
      next: (user) => this.isAuthenticatedSubject.next(!!user),
      complete: () => this.loadingSubject.next(false)
    });
  }

  getCurrentUser() {
    return this.http.get(`${this.apiUrl}/auth/user`, {
      withCredentials: true
    });
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
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
      tap(() => {
        this.isAuthenticatedSubject.next(true);
        this.loadingSubject.next(false);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/signout`, {}, {
      withCredentials: true 
    }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
        this.loadingSubject.next(false);
      })
    );
  }
}