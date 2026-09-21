import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageResponse} from '../../appUtils/Shared/page-response';
import {LogResponse} from '../../appUtils/LogsResponse/log-response';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly LOGS_URL = `${environment.backendUrl}/api/audit`;
  constructor(private http: HttpClient) {
  }

  getLogs(
    page: number,
    size: number
  ): Observable<PageResponse<LogResponse>>{
    return this.http.get<PageResponse<LogResponse>>(`${this.LOGS_URL}/get/logs`,
      {
        params: {
          page,
          size
        }
      });
  }
}
