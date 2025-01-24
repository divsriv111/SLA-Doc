import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, map, take, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoading$.pipe(
    filter(loading => !loading), // Continue when loading is false
    take(1), // Take only first emission after loading complete
    switchMap(() => authService.isAuthenticated$),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};