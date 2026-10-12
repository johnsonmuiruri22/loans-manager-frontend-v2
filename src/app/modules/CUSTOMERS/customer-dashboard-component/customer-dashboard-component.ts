import {Component, OnInit, signal} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {DashboardService} from '../../../SERVICES/DashboardService/dashboard-service';
import {CustomerDashboardSummaryDTO} from '../customer-dashboard-utils/customer-dashboard-response';
import {finalize} from 'rxjs';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-customer-dashboard-component',
  imports: [MATERIALModule, CommonModule],
  templateUrl: './customer-dashboard-component.html',
  styleUrl: './customer-dashboard-component.css',
})
export class CustomerDashboardComponent implements OnInit{
  loading = signal(false);
  protected readonly hasError = signal(false);
  customerLoanSummary: CustomerDashboardSummaryDTO | null = null;
  errorMessage = '';
  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadCustomerDashboard();
  }

  loadCustomerDashboard(): void{
    this.loading.set(true);
    this.hasError.set(false);
    this.errorMessage = '';
    this.dashboardService.getCustomerSummary()
      .pipe(
        finalize(()=>this.loading.set(false))
      ).subscribe({
      next: (response)=>{
        this.customerLoanSummary = response;
      },
      error: (error: Error)=>{
        this.hasError.set(true);
        this.errorMessage = error.message;
      }
    });
  }
}
