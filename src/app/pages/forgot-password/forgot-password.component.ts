import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  step: number = 1;

  isLoading: boolean = false;
  msgError: string = '';
  msgSuccess: string = '';

  verifyEmail: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  verifyCode: FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]],
  });

  resetPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z]\w{7,}$/)],
    ],
  });

  verifyEmailSubmit(): void {

    let emailValue = this.verifyEmail.get('email')?.value;
this.resetPassword.get('email')?.patchValue(emailValue);

    if (this.verifyEmail.valid) {
      this.isLoading = true;
      this.authService.setEmailVerify(this.verifyEmail.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.statusMsg === 'success') {
            this.step = 2;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.msgError = err.error.message;
          this.isLoading = false;
        },
      });
    } else {
      this.verifyEmail.markAllAsTouched();
    }
  }

  verifyCodeSubmit(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;
      this.authService.setCodeVerify(this.verifyCode.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'Success') {
            this.step = 3;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.msgError = err.error.message;
          this.isLoading = false;
        },
      });
    } else {
      this.verifyCode.markAllAsTouched();
    }
  }

  resetPasswordSubmit(): void {
    if (this.resetPassword.valid) {
      this.isLoading = true;
      this.authService.setResetPassword(this.resetPassword.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = true;

          localStorage.setItem('userToken', res.token);
          this.authService.saveUserData();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err);
          this.msgError = err.error.message;
          this.isLoading = true;
        },
      });
    } else {
      this.resetPassword.markAllAsTouched();
    }
  }
}
