import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DashboardSummaryDTO} from '../../modules/features/dashboard-utils/dashboard-summary';
import {LoanBorrowingTrend} from '../../modules/features/dashboard-utils/loan-borrowing-trend';
import {CustomerRegistrationTrend} from '../../modules/features/dashboard-utils/customer-registration-trend';
import {DashboardPeriod} from '../../modules/features/dashboard-utils/dashboard-period';

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

}
