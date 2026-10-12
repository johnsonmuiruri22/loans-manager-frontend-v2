import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {MatTableDataSource} from '@angular/material/table';
import {UserCardResponse} from '../../../../appUtils/UserUtils/user-card-response';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {UserService} from '../../../../SERVICES/UsersService/user-service';
import {NgClass, NgIf} from '@angular/common';
import {ReportService} from '../../../../SERVICES/ReportsService/report-service';
import {MatDialog} from '@angular/material/dialog';
import {AccountsStatusService} from '../../../../SERVICES/UsersService/accounts-status-service';
import {
  AccountStatusDialogComponent
} from '../../../shared/account-status-dialog-component/account-status-dialog-component';

@Component({
  selector: 'app-users-component',
  imports: [MATERIALModule, NgIf, NgClass],
  templateUrl: './users-component.html',
  styleUrl: './users-component.css',
  standalone: true
})
export class UsersComponent implements OnInit{

  datasource =
    new MatTableDataSource<UserCardResponse>();

  displayedColumns: string[] = ['userId','userFullName','username','userRole','status','actions'];

  isLoading = signal(false);
  hasError = signal(false);
  loadingUserId: number | null = null;

  pageIndex: number = 0;
  pageSize: number = 10;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService,
              private reportService: ReportService,
              private dialog: MatDialog,
              private accountsStatusService: AccountsStatusService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void{
    this.isLoading.set(true);
    this.userService.getUsers(this.pageIndex, this.pageSize).subscribe({
      next: (response)=>{
        this.isLoading.set(false);
        this.datasource.data = response.content;
        this.totalElements = response.totalElements;
        this.datasource.paginator = this.paginator;
      },
      error: (error: any)=>{
        this.isLoading.set(false);
        this.hasError.set(true);
        console.error('Error fetching user records',error);
      }
    });
  }

  onPageChange(event: PageEvent){
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  exportUsers(){
    this.reportService.exportUsers().subscribe({
      next: (blob)=>this.reportService.downloadExcel(blob,'users.xlsx'),
      error: (error: any)=>{
        console.error('Error exporting users',error);
      }
    });
  }

  disableAccount(user: UserCardResponse){
    const  dialogRef = this.dialog.open(
      AccountStatusDialogComponent,
      {
        width: '450px',
        data: {
          username: user.userFullName,
          action: 'DISABLE'
        }
      });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.loadingUserId = user.userId;
      this.accountsStatusService
        .disableAccount(user.userId)
        .subscribe({
          next: () => {
            // Update the user in your table
            user.status = 'INACTIVE';
            this.loadingUserId = null;
          },
          error: (error: Error) => {
            console.error(error);
            this.loadingUserId = null;
          }
        });
    });

  }

  enableAccount(user: UserCardResponse){
    const  dialogRef = this.dialog.open(
      AccountStatusDialogComponent,
      {
        width: '450px',
        data: {
          username: user.userFullName,
          action: 'ENABLE'
        }
      });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) {
        return;
      }

      this.loadingUserId = user.userId;
      this.accountsStatusService
        .enableAccount(user.userId)
        .subscribe({
          next: () => {
            // Update the user in your table
            user.status = 'ACTIVE';
            this.loadingUserId = null;
          },
          error: (error: Error) => {
            console.error(error);
            this.loadingUserId = null;
          }
        });
    });
  }

}
