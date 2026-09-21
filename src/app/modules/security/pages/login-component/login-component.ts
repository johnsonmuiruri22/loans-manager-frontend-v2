import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {AuthStateService} from '../../services/auth-state-service';
import {Router, RouterModule} from '@angular/router';
import {LoginRequest} from '../../models/login-request';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MATERIALModule} from '../../../material/material-module';
import {NgIf} from '@angular/common';
import {switchMap} from 'rxjs';

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
              private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }


  onLogin(){
    this.isLoading = true;
    const loginRequest: LoginRequest = this.loginForm.value;
    this.authService.login(loginRequest).pipe(
      switchMap(() => this.authState.loadCurrentUser())
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
