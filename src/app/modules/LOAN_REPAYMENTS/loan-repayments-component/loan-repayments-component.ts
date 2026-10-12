import {Component, OnInit, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {LoanRequestDetails} from '../../../appUtils/LoanUtils/loan-request-details';
import {PaymentRecordDTO} from '../../../appUtils/LoanRepaymentUtils/payment-record-dto';
import {MatPaginator} from '@angular/material/paginator';
import {LoanService} from '../../../SERVICES/LoanService/loan-service';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {PayLoanComponent} from '../pay-loan-component/pay-loan-component';
import {ReportService} from '../../../SERVICES/ReportsService/report-service';

@Component({
  selector: 'app-loan-repayments-component',
  imports: [MATERIALModule, CommonModule, MatSort],
  templateUrl: './loan-repayments-component.html',
  styleUrl: './loan-repayments-component.css',
})
export class LoanRepaymentsComponent implements OnInit{

  isLoading: boolean = false;

  datasource
    = new MatTableDataSource<PaymentRecordDTO>([]);

  displayedColumns: string[] = ['repaymentId', 'customerFullName', 'amountPaid',
    'totalAmountToBeRepaid', 'remainingBalance','repaymentStatus', 'actions']
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected hasError: any;

  constructor(private loanService: LoanService, private dialog: MatDialog,
              private excelService: ReportService) {
  }

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords(){
    this.isLoading = true;
    this.hasError = false;
    this.loanService.getRepaymentRecords(this.pageIndex, this.pageSize)
      .subscribe({
        next: (response)=>{
          this.isLoading = false;
          this.datasource.data = response.content;
          this.totalElements = response.totalElements;
          this.datasource.paginator = this.paginator;
        },
        error: (error: any)=>{
          this.isLoading = false;
          console.log('Error fetching repayment data',error);
          this.hasError = true;
        }
      });
  }

  exportRecords(){
    this.excelService.exportRepayments().subscribe({
      next: (blob)=> this.excelService.downloadExcel(blob, 'repayments.xlsx'),
      error: (error: any)=>{
        console.log(`Error exporting repayments`,error);
      }
    });

  }

  applyFilter(event: Event): void{
     const filterValue = (event.target as HTMLInputElement).value;
     this.datasource.filter = filterValue.trim().toLowerCase();
  }

  updatePayment(repayment: PaymentRecordDTO){
    const repaymentStatus = repayment.repaymentStatus;
    if (repaymentStatus === 'PAID_OFF'){
      alert(`This customer's Loan is already paid off`);
      return;
    }
    const payDialog = this.dialog.open(PayLoanComponent,
      {
        data: {...repayment}
      });
    payDialog.afterClosed().subscribe((result)=>{
      if(result){
        this.loadRecords();
      }
    });
  }


  printPayment(repayment: PaymentRecordDTO) {
    this.loanService
      .downloadReceipt(repayment.loanId)
      .subscribe({
        next: (response) => {
          const blob = response.body;
          if (!blob) {
            return;
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `loan-receipt-${repayment.loanId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },

        error: async (error) => {
          if (error.error instanceof Blob) {
            const errorText = await error.error.text();
            console.error(
              'Receipt download failed:',
              JSON.parse(errorText)
            );

          } else {
            console.error(
              'Failed to download repayment receipt:',
              error
            );
          }
        }
      });
  }

}
