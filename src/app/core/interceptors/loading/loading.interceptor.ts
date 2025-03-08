import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);

  // ✅ عرض اللودينج فقط إذا كانت الـ request من نوع GET
  if (req.method === 'GET') {
    ngxSpinnerService.show();
  }

  return next(req).pipe(
    finalize(() => {
      // ✅ إخفاء اللودينج فقط إذا كان قد تم تشغيله
      if (req.method === 'GET') {
        ngxSpinnerService.hide();
      }
    })
  );
};
