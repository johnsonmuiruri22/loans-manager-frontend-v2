import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {AuthStateService} from '../../services/auth-state-service';
import {Router, RouterModule} from '@angular/router';
import {LoginRequest} from '../../models/login-request';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MATERIALModule} from '../../../material/material-module';
import {NgIf} from '@angular/common';
import {finalize, map, of, switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private readonly authService: AuthService, private authState: AuthStateService,
              private router: Router, private fb: FormBuilder, private snackbar: MatSnackBar) {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }


  onLogin(){
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.snackbar.open('Please fill in login details correctly');
      return;
    }
    const loginRequest: LoginRequest =
      this.loginForm.getRawValue();

    this.isLoading = true;

    this.authService.login(loginRequest).pipe(
      switchMap((loginResponse) => {
        if (loginResponse.mustChangePassword){
          return of(loginResponse)
        }

        return this.authState.loadCurrentUser().pipe(
          map(()=> loginResponse)
        );
      }),
      finalize(()=>{
        this.isLoading = false;
      })
    ).subscribe({
      next: (loginResponse) => {
        this.snackbar.open(loginResponse.message,'Close',{duration: 2000});
        if (loginResponse.mustChangePassword){
          this.authState.setUser({
            id: loginResponse.userId,
            username: loginResponse.username,
            fullName: loginResponse.fullName,
            role: loginResponse.role,
            authenticated: true,
            mustChangePassword: true
          });
          this.router.navigate(['/must-change-password']);
          return;
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error)=>{
        const errorMessage = error?.error?.message || 'Login Failed';
        this.snackbar.open(errorMessage,'Close',{duration: 2000});
      }
    });
  }
}
