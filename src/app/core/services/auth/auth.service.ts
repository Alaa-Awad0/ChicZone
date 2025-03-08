import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { IUserData } from '../../../shared/interfaces/iuser-data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  userData: IUserData = {
    id: '',
    name: '',
    role: '',
    iat: 0,
    exp: 0,
  };

  private readonly router = inject(Router);

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  saveUserData(): void {
    if (localStorage.getItem('userToken') !== null) {
      // هنا ال package مش حاسه اننا اتأكدنا من ان ال local storage مش هتبقا ب null من ال if condition فوعدناها انها مش هتكون فاضية او ب null بال !
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      console.log(this.userData || 'No user data available');
    }
  }

  loguot(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('cartId');
    this.userData = {
      id: '',
      name: '',
      role: '',
      iat: 0,
      exp: 0,
    };
    this.router.navigate(['/login']);
  }

  setEmailVerify(data: object):Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  setCodeVerify(data: object):Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  setResetPassword(data: object):Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }
}
