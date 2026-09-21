import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStateService} from '../services/auth-state-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const allowedRoles =
    route.data['roles'] as string[] | undefined;

  const currentRole = authState.role();

  if (currentRole && allowedRoles?.includes(currentRole)) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
