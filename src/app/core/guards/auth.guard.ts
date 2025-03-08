import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const id = inject(PLATFORM_ID);


  if (isPlatformBrowser(id)) {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    }
    //navigate to login before prevent
    router.navigate(['/login']);
    return false;
  }

  return false;
};
