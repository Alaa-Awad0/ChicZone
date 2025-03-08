import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  return next(req).pipe(catchError((err) => {
    if (!req.url.includes('/login')) {
      toastrService.error(err.error.message, 'Error');
    }  return throwError(() => err);
}));
};
