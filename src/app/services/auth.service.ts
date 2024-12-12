import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private authStatusSubject: BehaviorSubject<boolean>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private errorService: ErrorService,
    @Inject('WINDOW') private window?: Window
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  register(data: RegistrationData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, data)
      .pipe(
        catchError(error => this.errorService.handleError(error))
      );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.authStatusSubject.next(true);
        }),
        catchError(error => this.errorService.handleError(error))
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.authStatusSubject.next(false);
    this.router.navigate(['/auth/login']).then(() => {
      if (this.isBrowser && this.window && !(this.window as any).isTestEnvironment) {
        this.window.location.reload();
      }
    });
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && !this.isTokenExpired();
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return true;

      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload || typeof payload.exp !== 'number') {
        return true;
      }
      
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return (currentTime + 1000) >= expirationTime;
    } catch {
      return true;
    }
  }

  isValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      return !!payload && 
             typeof payload.exp === 'number' && 
             payload.exp > (Date.now() / 1000); // Compare with current time in seconds
    } catch {
      return false;
    }
  }
} 