import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface LoginCredentials {
  username: string;
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
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    
    return this.http.post<LoginResponse>(`${environment.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.authStatusSubject.next(true);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.authStatusSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
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
} 