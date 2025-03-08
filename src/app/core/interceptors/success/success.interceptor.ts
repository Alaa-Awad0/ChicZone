// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { tap } from 'rxjs';
// import { HttpResponse } from '@angular/common/http';

// export const successInterceptor: HttpInterceptorFn = (req, next) => {
//   const toastrService = inject(ToastrService);

//   return next(req).pipe(
//     tap((event) => {
//       // ✅ تأكد أن الاستجابة من نوع HttpResponse فقط
//       if (event instanceof HttpResponse && req.method !== 'GET') {
//         // ✅ التحقق من أن body كائن يحتوي على message
//         const successMessage: any =
//           event.body && typeof event.body === 'object' && 'message' in event.body
//             ? event.body.message
//             : 'Request completed successfully';

//         toastrService.success(successMessage, 'Success');
//       }
//     }),
//   );
// };
