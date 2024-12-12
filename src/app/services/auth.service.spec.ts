import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send registration request to the backend', () => {
      const mockRegistration = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      service.register(mockRegistration).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Registration successful' });
    });
  });

  describe('login', () => {
    it('should store token and update auth status on successful login', () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'password123'
      };
      const mockResponse = { token: 'fake-jwt-token' };

      service.login(mockCredentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
      service.getAuthStatus().subscribe(status => {
        expect(status).toBe(true);
      });
    });
  });

  describe('logout', () => {
    it('should clear token, update auth status, and navigate to login', () => {
      // Setup
      localStorage.setItem('auth_token', 'fake-jwt-token');
      
      // Execute
      service.logout();
      
      // Verify
      expect(localStorage.getItem('auth_token')).toBeNull();
      service.getAuthStatus().subscribe(status => {
        expect(status).toBe(false);
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should handle logout when no token exists', () => {
      // Execute
      service.logout();
      
      // Verify
      expect(localStorage.getItem('auth_token')).toBeNull();
      service.getAuthStatus().subscribe(status => {
        expect(status).toBe(false);
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('token management', () => {
    it('should detect token expiration', () => {
      // Create an expired token (issued 3 hours ago)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      localStorage.setItem('auth_token', expiredToken);
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should validate token format', () => {
      const invalidToken = 'not-a-jwt-token';
      localStorage.setItem('auth_token', invalidToken);
      expect(service.isValidToken()).toBe(false);
    });
  });

  describe('auth status behavior', () => {
    beforeEach(() => {
      // Clear localStorage before creating the service
      localStorage.clear();
      
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
        ]
      });

      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
      routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    afterEach(() => {
      localStorage.clear();
      httpMock.verify();
    });

    it('should update auth status on login', fakeAsync(() => {
      const mockCredentials = {
        username: 'testuser',
        password: 'password123'
      };
      const mockResponse = { 
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6OTk5OTk5OTk5OX0.test-signature'
      };

      // Ensure no token exists
      expect(localStorage.getItem('auth_token')).toBeNull('Token should not exist initially');
      
      let authStatuses: boolean[] = [];
      service.getAuthStatus().subscribe(status => {
        authStatuses.push(status);
      });

      // Perform login
      service.login(mockCredentials).subscribe();

      // Simulate backend response
      const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);

      // Allow all async operations to complete
      tick();

      // Verify the sequence of auth states
      expect(authStatuses[0]).toBe(false, 'Initial auth status should be false');
      expect(authStatuses[authStatuses.length - 1]).toBe(true, 'Final auth status should be true');
      expect(localStorage.getItem('auth_token')).toBe(mockResponse.token, 'Token should be stored');
    }));
  });
}); 