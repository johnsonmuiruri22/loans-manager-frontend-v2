import {Component, signal} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {ResetPasswordRequest} from '../../utils/reset-password-request';

@Component({
  selector: 'app-reset-password-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
})
export class ResetPasswordComponent {

  resetForm!: FormGroup;
  loading = signal(false);

  constructor(private snackbar: MatSnackBar, private router: Router,
              private authService: AuthService, private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      username: ['',Validators.required]
    });
  }

  onReset(): void{
    if (this.resetForm.invalid){
      this.resetForm.markAllAsTouched();
      this.snackbar.open(
        'Please fill in the required fields',
        'Close',
        {duration: 3000})
      return;
    }

    const formValue = this.resetForm
      .getRawValue() as ResetPasswordRequest;
    this.loading.set(true);
    this.authService.resetUserPassword(formValue).subscribe({
      next: (response)=>{
        this.loading.set(false);
        this.snackbar.open(response.message);
        this.router.navigate(
          ['/change-user-password'],
          {
            queryParams: {
              token: response.resetToken
            }
          }
          )
      },
      error: (error)=>{
        console.error(
          'Password reset validation failed:',
          error
        );

        this.snackbar.open(
          error?.error?.message ||
          error?.message ||
          'Unable to verify the account details.'
        );
      }
    });


  }

}
