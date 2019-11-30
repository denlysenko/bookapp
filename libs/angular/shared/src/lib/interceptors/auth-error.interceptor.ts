import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FeedbackPlatformService, HTTP_STATUS } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly feedbackService: FeedbackPlatformService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === HTTP_STATUS.UNAUTHORIZED) {
          this.feedbackService.error(error.error.message);
          this.authService.logout().subscribe();
        }

        return throwError(error);
      })
    );
  }
}
