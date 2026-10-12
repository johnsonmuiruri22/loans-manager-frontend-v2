import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {DashboardSummaryDTO} from '../../modules/DASHBOARD/dashboard-utils/dashboard-summary';
import {LoanBorrowingTrend} from '../../modules/DASHBOARD/dashboard-utils/loan-borrowing-trend';
import {CustomerRegistrationTrend} from '../../modules/DASHBOARD/dashboard-utils/customer-registration-trend';
import {DashboardPeriod} from '../../modules/DASHBOARD/dashboard-utils/dashboard-period';
import {
  CustomerDashboardSummaryDTO
} from '../../modules/CUSTOMERS/customer-dashboard-utils/customer-dashboard-response';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly DASHBOARD_URL =
    `${environment.backendUrl}/api/loan-management/dashboard`;

  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummaryDTO> {

    return this.http.get<DashboardSummaryDTO>(
      `${this.DASHBOARD_URL}/summary`
    );
  }


  getLoanBorrowingTrend(
    period: DashboardPeriod
  ): Observable<LoanBorrowingTrend[]> {

    return this.http.get<LoanBorrowingTrend[]>(
      `${this.DASHBOARD_URL}/loan-trends`,
      {
        params: {
          period
        }
      }
    );
  }

  getCustomerRegistrationTrend(
    period: DashboardPeriod
  ): Observable<CustomerRegistrationTrend[]> {

    return this.http.get<CustomerRegistrationTrend[]>(
      `${this.DASHBOARD_URL}/customer-trends`,
      {
        params: {
          period
        }
      }
    );
  }

  getCustomerSummary(): Observable<CustomerDashboardSummaryDTO> {
    return this.http.get<CustomerDashboardSummaryDTO>(
      `${this.DASHBOARD_URL}/customer-profile/me`,
      { withCredentials: true }
    ).pipe(
      catchError((error: any) =>
        throwError(() => new Error(
          error?.error?.message ??
          'There was an error while fetching customer dashboard data!'
        ))
      )
    );
  }

}
