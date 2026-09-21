import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Dashboard} from './dashboard';
import {CustomersComponent} from '../customers-component/customers-component';
import {LoansComponent} from '../loans-component/loans-component';
import {UsersComponent} from '../users-component/users-component';
import {LogsComponent} from '../logs-component/logs-component';
import {AdminDashboard} from '../admin-dashboard/admin-dashboard';
import {LoanRepaymentsComponent} from '../loan-repayments-component/loan-repayments-component';
import {AccessForbiddenComponent} from '../access-forbidden-component/access-forbidden-component';

const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',redirectTo: 'adminDashboard',pathMatch: 'full'
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
        path: 'adminDashboard',component: AdminDashboard
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
