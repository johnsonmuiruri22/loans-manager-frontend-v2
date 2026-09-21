import { Routes } from '@angular/router';
import {LoginComponent} from './modules/security/pages/login-component/login-component';
import {authGuard} from './modules/security/guard/auth-guard';
import {guestGuard} from './modules/security/guard/guest-guard';

export const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login',component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/features/dashboard/dashboard-module').then(m => m.DashboardModule),
      canActivate: [authGuard]
  }
];
