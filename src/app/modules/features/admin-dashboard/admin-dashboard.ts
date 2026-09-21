import {Component, inject, OnInit, signal} from '@angular/core';
import {DashboardService} from '../../../SERVICES/DashboardService/dashboard-service';
import {DashboardSummaryDTO} from '../dashboard-utils/dashboard-summary';
import {LoanBorrowingTrend} from '../dashboard-utils/loan-borrowing-trend';
import {CustomerRegistrationTrend} from '../dashboard-utils/customer-registration-trend';
import {MATERIALModule} from '../../material/material-module';
import {forkJoin} from 'rxjs';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartOptions} from 'chart.js';
import {CommonModule} from '@angular/common';
import {DashboardPeriod} from '../dashboard-utils/dashboard-period';
import {AuthStateService} from '../../security/services/auth-state-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    MATERIALModule,
    BaseChartDirective,
  CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
  private readonly dashboardService =
    inject(DashboardService);

  readonly summary =
    signal<DashboardSummaryDTO | null>(null);

  readonly loanTrend =
    signal<LoanBorrowingTrend[]>([]);

  readonly customerTrend =
    signal<CustomerRegistrationTrend[]>([]);

  readonly loading = signal(true);

  readonly hasError = signal(false);

  readonly selectedPeriod =
    signal<DashboardPeriod>('LAST_12_MONTHS');

  private authState= inject(AuthStateService);
  readonly userRole = this.authState.username();


  ngOnInit() {
    this.loadDashboard();
  }

  loanChartData:
    ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [
      {
        data: [],
        label: 'Amount Borrowed',
        tension: 0.35,
        fill: true
      }
    ]
  };

  loanChartOptions:
    ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value =
              context.parsed.y ?? 0;
            return `KES ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            `KES ${Number(value).toLocaleString()}`
        }
      }
    }
  };

  loadDashboard(): void{
    this.loading.set(true);
    this.hasError.set(false);
    forkJoin({
      summary: this.dashboardService.getSummary(),
      loanTrend: this.dashboardService.getLoanBorrowingTrend(this.selectedPeriod()),
      customerTrend:
        this.dashboardService.getCustomerRegistrationTrend(this.selectedPeriod())
    }).subscribe({
      next: (response) => {
        this.summary.set(
          response.summary
        );

        this.loanTrend.set(
          response.loanTrend
        );

        this.customerTrend.set(
          response.customerTrend
        );

        this.buildLoanChart(
          response.loanTrend
        );

        this.buildCustomerChart(
          response.customerTrend
        );

        this.loading.set(false);
      },
      error: (error) => {
        console.error(
          'Failed to load dashboard:',
          error
        );
        this.loading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private buildLoanChart(data: LoanBorrowingTrend[]): void {
    this.loanChartData = {
      labels: data.map(
        item => this.formatPeriod(item.period)
      ),
      datasets: [
        {
          data: data.map(
            item => item.amount
          ),
          label: 'Amount Borrowed',
          tension: 0.35,
          fill: true
        }
      ]
    };
  }

  customerChartData:
    ChartConfiguration<'bar'>['data'] = {

    labels: [],

    datasets: [
      {
        data: [],
        label: 'Customers'
      }
    ]
  };

  customerChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  private buildCustomerChart(
    data: CustomerRegistrationTrend[]
  ): void {
    this.customerChartData = {
      labels: data.map(
        item => this.formatPeriod(item.period)
      ),
      datasets: [
        {
          data: data.map(
            item => item.customers
          ),
          label: 'Customers'
        }
      ]
    };
  }

  private formatPeriod(period: string): string {
    // Monthly: 2026-08
    if (period.length === 7) {
      const [year, month] =
        period.split('-');
      const date =
        new Date(
          Number(year),
          Number(month) - 1
        );
      return date.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          year: 'numeric'
        }
      );
    }
    // Daily: 2026-08-25
    const date = new Date(`${period}T00:00:00`);
    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric'
      }
    );
  }

  onPeriodChange(period: DashboardPeriod): void {
    this.selectedPeriod.set(period);
    this.loadCharts();
  }

  loadCharts(): void {
    const period =
      this.selectedPeriod();
    this.dashboardService
      .getLoanBorrowingTrend(period)
      .subscribe({
        next: data => {

          this.loanTrend.set(data);

          this.buildLoanChart(data);
        },

        error: error => {
          console.error(
            'Failed to load loan trend',
            error
          );
        }
      });

    this.dashboardService
      .getCustomerRegistrationTrend(period)
      .subscribe({
        next: data => {
          this.customerTrend.set(data);
          this.buildCustomerChart(data);
        },
        error: error => {
          console.error(
            'Failed to load customer trend',
            error
          );
        }
      });
  }
}
