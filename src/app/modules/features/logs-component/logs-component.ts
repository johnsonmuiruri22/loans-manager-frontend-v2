import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {CommonModule} from '@angular/common';
import {AuditService} from '../../../SERVICES/auditService/audit-service';
import {MatTableDataSource} from '@angular/material/table';
import {LogResponse} from '../../../appUtils/LogsResponse/log-response';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ReportService} from '../../../SERVICES/ReportsService/report-service';

@Component({
  selector: 'app-logs-component',
  imports: [MATERIALModule, CommonModule],
  templateUrl: './logs-component.html',
  styleUrl: './logs-component.css',
})
export class LogsComponent implements OnInit{

  datasource
    = new MatTableDataSource<LogResponse>([]);

  displayedColumns: string[] = ['logId', 'activity','logType','timestamp','ipAddress',
  'operatingSystem','deviceName','deviceType'];

  constructor(private logService: AuditService,
               private excelService: ReportService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  hasError: boolean = false;
  readonly loading = signal(false);
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  ngOnInit() {
    this.getLogs();
  }

  getLogs(){
    this.loading.set(true);
    this.hasError = false;

    this.logService.getLogs(this.pageIndex, this.pageSize).subscribe({
      next: (response)=>{
        this.loading.set(false);
        this.datasource.data = response.content;
        this.totalElements = response.totalElements;
        this.datasource.paginator = this.paginator;
      },
      error: (error: any)=>{
        this.loading.set(false);
        this.hasError = true;
        console.log('Error fetching logs',error);
      }
    });
  }

  downloadLogs(){
    this.excelService.exportAuditLogs().subscribe({
      next: (blob)=>this.excelService.downloadExcel(blob, 'audit-logs.xlsx'),
      error: (error: any)=>{
        console.log(`Error exporting audit logs`,error);
      }
    });

  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getLogs();
  }

}
