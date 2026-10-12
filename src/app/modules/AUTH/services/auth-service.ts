import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../models/login-request';
import {catchError, Observable, throwError} from 'rxjs';
import {LoginResponse} from '../models/login-response';
import {AuthenticatedUser} from '../models/authenticated-user';
import {ApiErrorResponse} from '../../../appUtils/AppResponse/api-error-response';
import {ResetPasswordRequest} from '../utils/reset-password-request';
import {ResetPasswordResponse} from '../utils/reset-password-response';
import {ChangePasswordRequest} from '../utils/change-password-request';
import {ChangePasswordResponse} from '../utils/change-password-response';
import {MustChangePasswordRequest} from '../utils/must-change-pass-request';
import {MustChangePasswordResponse} from '../utils/must-change-pass-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BACKEND_URL = `${environment.backendUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>( `${this.BACKEND_URL}/login`,
      request,
      {
        withCredentials: true
      }).pipe(catchError((error: ApiErrorResponse)=>{
        return throwError(()=> new Error(error.message));
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.BACKEND_URL}/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }

  refresh(): Observable<void> {
    return this.http.post<void>(
      `${this.BACKEND_URL}/refresh`,
      {},
      {
        withCredentials: true
      }
    );
  }

  me(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(
      `${this.BACKEND_URL}/me`,
      {
        withCredentials: true
      }
    );
  }

  resetUserPassword(
    resetRequest: ResetPasswordRequest
  ): Observable<ResetPasswordResponse>{
    return this.http.post<ResetPasswordResponse>(
      `${this.BACKEND_URL}/reset-password`,resetRequest,{
        withCredentials: true
      }
    ).pipe(
      catchError((error: any)=>{
        return throwError(()=> new Error(error?.error?.message || 'Error resetting password'))
      })
    );
  }

  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<ChangePasswordResponse>{
    return this.http.post<ChangePasswordResponse>(
      `${this.BACKEND_URL}/change-password`,changePasswordRequest,{
        withCredentials: true
      }
    ).pipe(
      catchError((error: any)=>{
        return throwError(()=> new Error(error?.error?.message || 'Error changing password'))
      })
    );
  }

  mustChangePassword(
    mustChangePasswordRequest: MustChangePasswordRequest
  ): Observable<MustChangePasswordResponse>{
    return this.http.post<MustChangePasswordResponse>(
      `${this.BACKEND_URL}/must-change-password`,
      mustChangePasswordRequest,
      {
        withCredentials: true
      }
    ).pipe(
      catchError((error: ApiErrorResponse)=>{
        return throwError(()=> error.message);
      })
    );
  }
}
