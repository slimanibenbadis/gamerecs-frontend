import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' } // Simulate browser environment
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login request and store token', () => {
    const mockCredentials = { username: 'testuser', password: 'password123' };
    const mockResponse = { token: 'mock-jwt-token' };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should clear token on logout', () => {
    // First set a token
    service.setToken('mock-token');
    expect(service.isAuthenticated()).toBe(true);

    // Then logout
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should correctly check authentication status', () => {
    expect(service.isAuthenticated()).toBe(false);
    service.setToken('mock-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  describe('Server-side rendering', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthService,
          { provide: PLATFORM_ID, useValue: 'server' } // Simulate server environment
        ]
      });
      service = TestBed.inject(AuthService);
    });

    it('should handle localStorage operations safely during SSR', () => {
      expect(service.getToken()).toBeNull();
      service.setToken('test-token'); // Should not throw error
      expect(service.isAuthenticated()).toBeFalse();
      service.logout(); // Should not throw error
    });
  });
}); 