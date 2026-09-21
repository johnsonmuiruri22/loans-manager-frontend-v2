import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStateService} from '../services/auth-state-service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAuthenticated()){
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
