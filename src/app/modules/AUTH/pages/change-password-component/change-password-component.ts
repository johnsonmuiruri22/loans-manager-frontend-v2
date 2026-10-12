import {Component, OnInit} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-change-password-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password-component.html',
  styleUrl: './change-password-component.css',
})
export class ChangePasswordComponent implements OnInit{

  passwordForm!: FormGroup;
  resetToken: string | null = null;
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar,
              private router: Router, private authService: AuthService,
              private route: ActivatedRoute) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void{
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.snackbar.open(
        'Password must contain at least 8 characters.'
      );
      return;
    }

    const { newPassword, confirmPassword } =
      this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.snackbar.open(
        'Passwords do not match.'
      );
      return;
    }

    if (!this.resetToken) {
      this.snackbar.open(
        'Invalid or missing password reset token.'
      );
      return;
    }

    const request = {
      resetToken: this.resetToken,
      newPassword,
      confirmPassword
    };

    this.authService.changePassword(request).subscribe({
      next: (response) => {
        this.snackbar.open(
          response.message
        );
        this.router.navigate(['/login']);
      },

      error: (error) => {
        this.snackbar.open(
          error?.message ||
          'Unable to change password.'
        );
      }
    });


  }



}
