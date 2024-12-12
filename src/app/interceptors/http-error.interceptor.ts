import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return errorService.handleError(error);
    })
  );
}; 