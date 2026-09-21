import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../models/login-request';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {LoginResponse} from '../models/login-response';
import {AuthenticatedUser} from '../models/authenticated-user';
import {ApiErrorResponse} from '../../../appUtils/AppResponse/api-error-response';

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
      }).pipe(
        tap(response => response.message),
      catchError((error: ApiErrorResponse)=>{
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
}
