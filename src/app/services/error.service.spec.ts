import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';

describe('ErrorService', () => {
  let service: ErrorService;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        { provide: MessageService, useValue: spy }
      ]
    });
    service = TestBed.inject(ErrorService);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle client-side errors', () => {
    const errorEvent = new ErrorEvent('Client Error', {
      message: 'Client-side error occurred'
    });
    const error = new HttpErrorResponse({
      error: errorEvent,
      status: 0
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Client-side error occurred');
      }
    });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Connection Error',
      detail: 'Client-side error occurred',
      life: 5000
    });
  });

  it('should handle server-side errors with ErrorResponse', () => {
    const serverError = {
      status: 400,
      error: 'Bad Request',
      message: 'Invalid input data',
      timestamp: '2023-01-01 12:00:00'
    };
    const error = new HttpErrorResponse({
      error: serverError,
      status: 400,
      statusText: 'Bad Request'
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid input data');
      }
    });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Invalid Request',
      detail: 'Invalid input data',
      life: 5000
    });
  });

  it('should handle network connectivity errors', () => {
    const error = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error'
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Unable to connect to the server. Please check your internet connection.');
      }
    });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Connection Error',
      detail: 'Unable to connect to the server. Please check your internet connection.',
      life: 5000
    });
  });

  it('should handle 404 errors with warning severity', () => {
    const serverError = {
      status: 404,
      error: 'Not Found',
      message: 'Resource not found',
      timestamp: '2023-01-01 12:00:00'
    };
    const error = new HttpErrorResponse({
      error: serverError,
      status: 404,
      statusText: 'Not Found'
    });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Resource not found');
      }
    });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Not Found',
      detail: 'Resource not found',
      life: 5000
    });
  });

  it('should log errors to console in development environment', () => {
    spyOn(console, 'error');
    const originalEnv = environment.production;
    (environment as any).production = false;

    const error = new HttpErrorResponse({
      error: 'Test error',
      status: 500
    });

    service.handleError(error).subscribe({
      error: () => {
        expect(console.error).toHaveBeenCalled();
      }
    });

    // Restore environment
    (environment as any).production = originalEnv;
  });
}); 