import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {catchError, map, Observable, of, tap, throwError} from 'rxjs';
import {AppResponse} from '../../appUtils/AppResponse/app-response';
import {HttpClient} from '@angular/common/http';
import {CustomerRespDTO} from '../../appUtils/CustomerUtils/Utils/customer-resp-dto';
import {CustomerReqDTO} from '../../appUtils/CustomerUtils/Utils/customer-req-dto';
import {LoanRequestDTO} from '../../appUtils/LoanUtils/loan-request-dto';
import {CustomerLoanRequest} from '../../appUtils/LoanUtils/customer-loan-request';
import {PageResponse} from '../../appUtils/Shared/page-response';
import {ApiErrorResponse} from '../../appUtils/AppResponse/api-error-response';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly CUSTOMERS_URL = `${environment.backendUrl}/api/v1/customers`;

  constructor(private http: HttpClient) {
  }

  getCustomers(
    page: number,
    size: number
  ): Observable<PageResponse<CustomerRespDTO>> {

    return this.http.get<PageResponse<CustomerRespDTO>>(
      `${this.CUSTOMERS_URL}/get/all`,
      {
        params: {
          page,
          size
        }
      }
    ).pipe(
      catchError((error: any) => {
        console.error('Failed to load customers', error);
        throw error;
      })
    );
  }

  addCustomer(customer: CustomerReqDTO): Observable<AppResponse>{
    return this.http.post<AppResponse>(`${this.CUSTOMERS_URL}/register`, customer).pipe(
      tap(response => response.customerToGet),
      catchError((error: ApiErrorResponse)=>{
        return throwError(()=> new Error(error.message));
      })
    );
  }

  deleteCustomer(customerId: number): Observable<AppResponse>{
    return this.http.delete<AppResponse>(`${this.CUSTOMERS_URL}/delete/${customerId}`).pipe(
      tap(response => response.message),
      catchError((error: ApiErrorResponse)=>{
        return throwError(()=> new Error(error.message));
      })
    );
  }

  getCustomerData(customerId: number): Observable<CustomerRespDTO>{
    return this.http.get<AppResponse>(`${this.CUSTOMERS_URL}/get/customer/${customerId}`).pipe(
      map(response => response.customerToGet),
      catchError((error: ApiErrorResponse)=>{
        return throwError(()=> new Error(error.message));
      })
    );
  }

  requestLoan(loanRequest: LoanRequestDTO): Observable<CustomerLoanRequest>{
    return this.http.post<CustomerLoanRequest>(`${this.CUSTOMERS_URL}/requestLoan`, loanRequest).pipe(
      tap(response => response.message),
      catchError((error: ApiErrorResponse)=> {
        return throwError(()=> new Error(error.message));
      })
    );
  }

  updateCustomer(
    customerId: number,
    customerToEdit: CustomerReqDTO
    ): Observable<CustomerRespDTO>{
    return this.http.put<CustomerRespDTO>(
      `${this.CUSTOMERS_URL}/update/${customerId}`,
      customerToEdit).pipe(
      tap(response => response.customMessage),
      catchError((error: ApiErrorResponse)=>{
        return throwError(()=> new Error(error.message));
      })
    );
  }

}
