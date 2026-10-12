import { Routes } from '@angular/router';
import {LoginComponent} from './modules/AUTH/pages/login-component/login-component';
import {ResetPasswordComponent} from './modules/AUTH/pages/reset-password-component/reset-password-component';
import {ChangePasswordComponent} from './modules/AUTH/pages/change-password-component/change-password-component';
import {
  MustChangePasswordComponent
} from './modules/AUTH/pages/must-change-password-component/must-change-password-component';
import {guestGuard} from './modules/AUTH/guard/guest-guard';
import {mustChangePasswordGuard} from './modules/AUTH/guard/must-change-password-guard';
import {authGuard} from './modules/AUTH/guard/auth-guard';

export const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login',component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'change-user-password',
    component: ChangePasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'must-change-password',
    component: MustChangePasswordComponent,
    canActivate: [mustChangePasswordGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/DASHBOARD/dashboard/dashboard-module').then(m => m.DashboardModule),
      canActivate: [authGuard]
  }
];
