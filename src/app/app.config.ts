import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthStateService} from './modules/AUTH/services/auth-state-service';
import {catchError, firstValueFrom, of} from 'rxjs';
import {provideNativeDateAdapter} from '@angular/material/core';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {authInterceptor} from './modules/AUTH/interceptor/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideCharts(
      withDefaultRegisterables()
    ),
    provideAppInitializer(async ()=>{
      const authState = inject(AuthStateService);
      try {
        await firstValueFrom(
          authState.loadCurrentUser().pipe(
            catchError(()=>{
              authState.clearUser();
              return of(null);
            })
          )
        );
      } finally {
        authState.markInitialized();
      }
      }
    )
  ]
};
