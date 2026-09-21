import { Component } from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../security/services/auth-service';
import {AuthStateService} from '../../security/services/auth-state-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MATERIALModule, RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(private router: Router, private authService: AuthService,
              public authState: AuthStateService) {
  }

  logoutUser(){
    this.authService.logout()
      .subscribe({
        next: () => {
          this.authState.clearUser();
          this.router.navigate(['/login']);
        },
        error: () => {
          this.authState.clearUser();
          this.router.navigate(['/login']);
        }
      });
  }
}
