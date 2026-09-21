import {Component, OnInit, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {CommonModule} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {LoanRequests} from '../../../appUtils/LoanUtils/LoanRequests';
import {MatPaginator} from '@angular/material/paginator';
import {LoanService} from '../../../SERVICES/LoanService/loan-service';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {LoanProcessingComponent} from '../LOANS-PAGES/loan-processing-component/loan-processing-component';
import {ReportService} from '../../../SERVICES/ReportsService/report-service';

@Component({
  selector: 'app-loans-component',
  imports: [MATERIALModule, CommonModule, MatSort],
  templateUrl: './loans-component.html',
  styleUrl: './loans-component.css',
})
export class LoansComponent implements OnInit{

  isLoading: boolean = false;

  datasource
    = new MatTableDataSource<LoanRequests>([]);

  displayedColumns: string[] = ['loanId', 'customerInformation', 'loanAmountRequested',
    'loanAmountIssued', 'loanPurpose','loanStatus', 'actions']
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(private loanService: LoanService, private dialog: MatDialog,
              private exportService: ReportService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  protected hasError: any;

  ngOnInit() {
    this.loadLoansData();
  }


  loadLoansData(){
    this.isLoading = true;
    this.hasError = false;
    this.loanService.getLoanRecords(this.pageIndex, this.pageSize).subscribe({
      next: (response)=>{
        this.datasource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error: any)=>{
        console.log(`Error loading loans data`,error);
        this.hasError = true;
        this.isLoading = false;
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

  viewAndModify(loan: LoanRequests){
    const reqDialog = this.dialog.open(LoanProcessingComponent,
      {
        width: '850px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        data: {...loan}
      });
    reqDialog.afterClosed().subscribe((response)=>{
      if (response){
        this.loadLoansData();
      }
    })
  }

  viewLoanInfo(loan: LoanRequests){

  }

}
