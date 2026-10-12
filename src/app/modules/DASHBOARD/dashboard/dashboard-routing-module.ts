import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Dashboard} from './dashboard';
import {CustomersComponent} from '../../CUSTOMERS/customers-component/customers-component';
import {LoansComponent} from '../../LOANS/loan-pages/loans-component/loans-component';
import {UsersComponent} from '../../AUTH/users/users-component/users-component';
import {LogsComponent} from '../../LOGS/logs-component/logs-component';
import {AdminDashboard} from '../pages/admin-dashboard/admin-dashboard';
import {LoanRepaymentsComponent} from '../../LOAN_REPAYMENTS/loan-repayments-component/loan-repayments-component';
import {AccessForbiddenComponent} from '../pages/access-forbidden-component/access-forbidden-component';
import {CustomerDashboardComponent} from '../../CUSTOMERS/customer-dashboard-component/customer-dashboard-component';
import {HomeComponent} from '../pages/home-component/home-component';

const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',redirectTo: 'home',pathMatch: 'full'
      },
      {
        path: 'customers',component: CustomersComponent
      },
      {
        path: 'loans',component: LoansComponent
      },
      {
        path: 'repayments',component: LoanRepaymentsComponent
      },
      {
        path: 'users',component: UsersComponent
      },
      {
        path: 'logs',component: LogsComponent
      },
      {
        path: 'home',component: HomeComponent
      },
      {
        path: 'overview-dashboard',component: AdminDashboard
      },
      {
        path: 'customer-dashboard',component: CustomerDashboardComponent
      },
      {
        path: 'forbidden',component: AccessForbiddenComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
