import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountsStatusService {
  private readonly BACKEND_URL = `${environment.backendUrl}/api/user-accounts`;
  private http: HttpClient = inject(HttpClient);

  disableAccount(
    userId: number
  ): Observable<void>{
    return this.http.put<void>(
      `${this.BACKEND_URL}/disable/account/${userId}`,{}
    ).pipe(
      catchError((error: any)=>{
        return throwError(()=> new Error(
          error?.error?.message || 'Error disabling account!'
        ));
      })
    );
  }

  enableAccount(
    userId: number
  ): Observable<void>{
    return this.http.put<void>(
      `${this.BACKEND_URL}/enable/account/${userId}`,{}
    ).pipe(
      catchError((error: any)=>{
        return throwError(()=> new Error(
          error?.error?.message || 'Error enabling account!'
        ));
      })
    );
  }

}
