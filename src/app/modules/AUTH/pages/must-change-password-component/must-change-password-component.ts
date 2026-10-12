import {Component, inject, signal} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {AuthStateService} from '../../services/auth-state-service';

@Component({
  selector: 'app-must-change-password-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule],
  templateUrl: './must-change-password-component.html',
  styleUrl: './must-change-password-component.css',
})
export class MustChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly snackbar = inject(MatSnackBar)

  isLoading = signal(false);
  successMessage: string= '';
  errorMessage: string= '';

  readonly changePasswordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void{
    this.errorMessage = '';
    this.successMessage = '';

    if (this.changePasswordForm.invalid){
      this.snackbar.open('Please fill in the required fields.');
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = this.changePasswordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match!';
      this.snackbar.open(this.errorMessage);
      return;
    }

    this.isLoading.set(true);
    this.authService.mustChangePassword({currentPassword, newPassword }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage = 'Password changed successfully';
        this.authState.loadCurrentUser().subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.errorMessage = 'Password changed but we could not refresh your session';
            this.snackbar.open(this.errorMessage);
          }
        })
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage =
          error?.error?.message ?? 'Unable to change password';
        this.snackbar.open(this.errorMessage);
      }
    })
  }

}
