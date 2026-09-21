import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {CustomerService} from '../../../SERVICES/CustomerService/customer-service';
import {CustomerRespDTO} from '../../../appUtils/CustomerUtils/Utils/customer-resp-dto';
import {MATERIALModule} from '../../material/material-module';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {
  AddCustomerComponent
} from '../../../appUtils/CustomerUtils/Components/add-customer-component/add-customer-component';
import {AppResponse} from '../../../appUtils/AppResponse/app-response';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  ViewCustomerComponent
} from '../../../appUtils/CustomerUtils/Components/view-customer-component/view-customer-component';
import {LoanRequestComponent} from '../LOANS-PAGES/loan-request-component/loan-request-component';
import {Router} from '@angular/router';
import {ReportService} from '../../../SERVICES/ReportsService/report-service';
import {
  UpdateCustomerComponent
} from '../../../appUtils/CustomerUtils/Components/update-customer-component/update-customer-component';

@Component({
  selector: 'app-customers-component',
  imports: [MATERIALModule, MatSort, CommonModule],
  templateUrl: './customers-component.html',
  styleUrl: './customers-component.css',
})
export class CustomersComponent implements OnInit{

  isLoading =  signal(false);
  hasError = signal(false);
  tableColumns: string[]=['name','age','email','phone','residence','occupation','actions'];
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  dataSource =
    new MatTableDataSource<CustomerRespDTO>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private customerService: CustomerService, private dialog: MatDialog,
              private snackbar: MatSnackBar, private router: Router, private reportService: ReportService) {
  }

  ngOnInit() {
    this.loadCustomerData();
  }

  loadCustomerData(){
    this.isLoading.set(true);
    this.customerService.getCustomers(this.pageIndex, this.pageSize).subscribe({
      next: (response)=>{
        this.isLoading.set(false);
        console.log(response.content);
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error)=>{
        this.isLoading.set(false);
        this.hasError.set(true);
        console.log(error);
      }
    });

  }

  openCustomerDialog(){
    const customerDialog = this.dialog.open(AddCustomerComponent,
      {
        width: '80vw',
        maxWidth: '900px',
        maxHeight: '90vh',
        autoFocus: false
      });

    customerDialog.afterClosed().subscribe({
      next: (customer: CustomerRespDTO)=>{
        if(customer){
          this.loadCustomerData();
        }
      }
    });
  }

  editCustomer(customerToEdit: CustomerRespDTO){
    const updateDialog = this.dialog.open(UpdateCustomerComponent,
      {
        data: {...customerToEdit}
      });

    updateDialog.afterClosed().subscribe((result)=>{
      if (result){
        this.loadCustomerData();
      }
    })
  }

  deleteCustomer(customerToDelete: CustomerRespDTO){
    if (confirm(`Are you sure you want to delete this customer?\n
    This action cannot be undone.`)){
      this.customerService.deleteCustomer(customerToDelete.customerId).subscribe({
        next: (response: AppResponse)=>{
          this.snackbar.open(response.message, 'Close',{duration: 3000});
          this.loadCustomerData();
        },
        error: (err: any)=>{
          this.snackbar.open('Error deleting customer', 'Close',{duration: 3000});
          console.log('Error deleting customer',err);
        }
      });
    }
  }

  viewCustomer(customerToView: CustomerRespDTO){
    this.dialog.open(ViewCustomerComponent,
      {
        width: '80vw',
        maxWidth: '900px',
        maxHeight: '90vh',
        autoFocus: false,
        data: customerToView
      });
  }

  exportCustomers(): void {
    this.reportService.exportCustomers().subscribe({
      next: (blob) => this.reportService.downloadExcel(blob, 'customers.xlsx'),
      error: (error) => {
        console.error('Failed to export customers:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  requestLoanForCustomer(customer: CustomerRespDTO){
    const dialog = this.dialog.open(LoanRequestComponent,{
      data: {...customer}
    });

    dialog.afterClosed().subscribe((response)=>{
      if(response){
        this.router.navigate(['/dashboard/loans']);
        this.loadCustomerData();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCustomerData();
  }
}
