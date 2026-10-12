import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {LoanRequestDetails} from '../../../../appUtils/LoanUtils/loan-request-details';
import {MatPaginator} from '@angular/material/paginator';
import {LoanService} from '../../../../SERVICES/LoanService/loan-service';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {LoanProcessingComponent} from '../loan-processing-component/loan-processing-component';
import {ReportService} from '../../../../SERVICES/ReportsService/report-service';

@Component({
  selector: 'app-loans-component',
  imports: [MATERIALModule, CommonModule, MatSort],
  standalone: true,
  templateUrl: './loans-component.html',
  styleUrl: './loans-component.css',
})
export class LoansComponent implements OnInit{

  isLoading = signal(false);
  datasource
    = new MatTableDataSource<LoanRequestDetails>([]);

  displayedColumns: string[] = ['loanId', 'customerInformation', 'loanAmountRequested',
    'loanAmountIssued', 'loanPurpose','loanStatus', 'actions']
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(private loanService: LoanService, private dialog: MatDialog,
              private exportService: ReportService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected hasError = signal(false);

  ngOnInit() {
    this.loadLoansData();
  }


  loadLoansData(){
    this.isLoading.set(true);
    this.hasError.set(false);
    this.loanService.getLoanRecords(this.pageIndex, this.pageSize).subscribe({
      next: (response)=>{
        this.isLoading.set(false);
        this.datasource.data = response.content;
        this.totalElements = response.totalElements;
        this.datasource.paginator = this.paginator;
      },
      error: (error: any)=>{
        console.log(`Error loading loans data`,error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  exportLoans(){
    this.exportService.exportLoans().subscribe({
      next: (blob)=>this.exportService.downloadExcel(blob, 'loans.xlsx'),
      error: (error: any)=>{
        console.log(`Error exporting loans`,error);
      }
    });

  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  viewAndModify(loan: LoanRequestDetails) {
    const reqDialog = this.dialog.open(LoanProcessingComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      height: 'auto',

      data: {
        ...loan
      },

      panelClass: 'loan-processing-dialog',

      autoFocus: false,
      restoreFocus: true,
      closeOnNavigation: true
    });

    reqDialog.afterClosed().subscribe((response) => {
      if (response) {
        this.loadLoansData();
      }
    });
  }
}
