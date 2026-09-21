import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly REPORTS_URL = `${environment.backendUrl}/api/loan-management/reports`;

  constructor(private http: HttpClient) {
  }


  exportCustomers(): Observable<Blob>{
    return this.http.get(`${this.REPORTS_URL}/customers/excel`,
      {responseType: 'blob'});
  }

  exportLoans(): Observable<Blob>{
    return this.http.get(`${this.REPORTS_URL}/loans/excel`,
      {responseType: 'blob'});
  }

  exportRepayments(): Observable<Blob>{
    return this.http.get(`${this.REPORTS_URL}/repayments/excel`,
      {responseType: 'blob'});
  }

  exportAuditLogs(): Observable<Blob>{
    return this.http.get(`${this.REPORTS_URL}/audit-logs/excel`,
      {responseType: 'blob'});
  }

  exportUsers(): Observable<Blob>{
    return this.http.get(`${this.REPORTS_URL}/users/excel`,
      {responseType: 'blob'});
  }

  downloadExcel(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
  }

}
