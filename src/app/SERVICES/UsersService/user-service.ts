import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageResponse} from '../../appUtils/Shared/page-response';
import {UserCardResponse} from '../../appUtils/UserUtils/user-card-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_URL =
    `${environment.backendUrl}/api/loan-management/users`;
  private readonly http = inject(HttpClient);

  getUsers(
    page: number,
    size: number
  ): Observable<PageResponse<UserCardResponse>>{
    return this.http.get<PageResponse<UserCardResponse>>(
      `${this.USERS_URL}/all`,{
        params:{
          page,
          size
        }
      });
  }

}
