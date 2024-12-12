import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private messageService: MessageService) {}

  /**
   * Handles HTTP errors and displays appropriate messages to the user
   * @param error The HTTP error response
   * @returns An Observable that errors with the processed error
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let severity: 'error' | 'warn' = 'error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.error && typeof error.error === 'object') {
        const serverError = error.error as ErrorResponse;
        errorMessage = serverError.message || error.message;
        
        // Adjust severity based on status code
        if (error.status === 404) {
          severity = 'warn';
        }
      }
    }

    // Display the error message using PrimeNG's MessageService
    this.messageService.add({
      severity: severity,
      summary: this.getErrorSummary(error.status),
      detail: errorMessage,
      life: 5000 // Message will be displayed for 5 seconds
    });

    // Log error to console in development
    if (!environment.production) {
      console.error('Error details:', error);
    }

    // Return an observable error for the calling code to handle
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Gets a user-friendly error summary based on the HTTP status code
   */
  private getErrorSummary(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid Request';
      case 401:
        return 'Authentication Error';
      case 403:
        return 'Access Denied';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict Error';
      case 422:
        return 'Validation Error';
      case 500:
        return 'Server Error';
      case 0:
        return 'Connection Error';
      default:
        return 'Error';
    }
  }
} 