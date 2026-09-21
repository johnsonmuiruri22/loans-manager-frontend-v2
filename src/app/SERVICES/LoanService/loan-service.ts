import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {LoanRequests} from '../../appUtils/LoanUtils/LoanRequests';
import {PageResponse} from '../../appUtils/Shared/page-response';
import {LoanProcessingInfo} from '../../appUtils/LoanUtils/loan-processing-info';
import {LoanProcessedResponse} from '../../appUtils/LoanUtils/loan-processed-response';
import {PaymentRecordDTO} from '../../appUtils/LoanRepaymentUtils/payment-record-dto';
import {RepaymentRequest} from '../../appUtils/LoanRepaymentUtils/repayment-request';
import {ApiErrorResponse} from '../../appUtils/AppResponse/api-error-response';

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  private readonly LOANS_URL = `${environment.backendUrl}/api/v1/loans`;

  constructor(private http: HttpClient) { }

  getLoanRecords(
    page: number,
    size: number): Observable<PageResponse<LoanRequests>>{
    return this.http.get<PageResponse<LoanRequests>>(`${this.LOANS_URL}/get/all`,{
      params: {
        page,
        size
      }
    });
  }

  processLoan(loanProcessingRequest: LoanProcessingInfo):
  Observable<LoanProcessedResponse>{
    return this.http.put<LoanProcessedResponse>(`${this.LOANS_URL}/process/loan`,
      loanProcessingRequest).pipe(
        tap(response => response.message),
      catchError((apiError: ApiErrorResponse)=>{
        return throwError(() => new Error(apiError.message));
      })
    )
  }

  getRepaymentRecords(
    page:number,
    size: number
  ): Observable<PageResponse<PaymentRecordDTO>>{
    return this.http.get<PageResponse<PaymentRecordDTO>>(`${this.LOANS_URL}/repayments`,
      {
        params: {
          page,
          size
        }
      })
  }

  payLoan(repaymentRequest: RepaymentRequest): Observable<PaymentRecordDTO>{
    return this.http.put<PaymentRecordDTO>(`${this.LOANS_URL}/repayments/pay`,
      repaymentRequest).pipe(
        tap(response => response.message),
      catchError((apiError: ApiErrorResponse)=>{
        return throwError(()=> new Error(apiError.message));
      })
    );
  }

}
