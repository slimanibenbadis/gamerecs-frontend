import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorService } from '../services/error.service';
import { of, throwError } from 'rxjs';

describe('httpErrorInterceptor', () => {
  let errorService: jasmine.SpyObj<ErrorService>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorService, useValue: errorServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should handle HTTP errors using ErrorService', (done) => {
    const request = new HttpRequest('GET', '/test');
    const errorResponse = new HttpErrorResponse({
      error: 'test error',
      status: 404,
      statusText: 'Not Found'
    });

    const next = () => throwError(() => errorResponse);
    errorService.handleError.and.returnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(request, next).subscribe({
        error: (error) => {
          expect(errorService.handleError).toHaveBeenCalledWith(errorResponse);
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });

  it('should pass through successful responses', (done) => {
    const request = new HttpRequest('GET', '/test');
    const mockResponse = new HttpResponse<unknown>({
      body: { data: 'test' },
      status: 200
    });

    const next = () => of(mockResponse);

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(request, next).subscribe({
        next: (response) => {
          expect(response).toBe(mockResponse);
          expect(errorService.handleError).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
}); 