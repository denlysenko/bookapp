import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { FeedbackPlatformService } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { HTTP_STATUS } from '@bookapp/shared/constants';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const feedbackService = inject(FeedbackPlatformService);

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === HTTP_STATUS.UNAUTHORIZED) {
        feedbackService.error(error.error.message);
        authService.logout().subscribe();
      }

      return throwError(() => error);
    })
  );
};
