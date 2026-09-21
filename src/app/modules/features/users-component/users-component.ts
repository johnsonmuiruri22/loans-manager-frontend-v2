import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {MatTableDataSource} from '@angular/material/table';
import {UserCardResponse} from '../../../appUtils/UserUtils/user-card-response';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {UserService} from '../../../SERVICES/UsersService/user-service';
import {DatePipe, NgIf} from '@angular/common';
import {ReportService} from '../../../SERVICES/ReportsService/report-service';

@Component({
  selector: 'app-users-component',
  imports: [MATERIALModule, NgIf],
  templateUrl: './users-component.html',
  styleUrl: './users-component.css',
})
export class UsersComponent implements OnInit{

  datasource =
    new MatTableDataSource<UserCardResponse>();

  displayedColumns: string[] = ['userId','surname','otherNames','username','userRole'];

  isLoading = signal(false);
  hasError = signal(false);

  pageIndex: number = 0;
  pageSize: number = 10;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService,
              private reportService: ReportService) {
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

}
