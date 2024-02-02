import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore, selectIsLoggedIn, selectUserState } from '@core/store/auth';
import { hasNoAuthority, shouldShowAccepted, shouldShowDisabled } from '@core/util/user-status-util';

@Injectable()
export class LandingPageGuard implements CanActivate {
  constructor(
    private readonly authStore: AuthStore,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkUser().pipe(
      switchMap(() => combineLatest([this.authStore.pipe(selectIsLoggedIn), this.authStore.pipe(selectUserState)])),
      map(([isLoggedIn, userState]) => {
        if (!isLoggedIn) {
          return true;
        }

        if (['REGULATOR', 'VERIFIER'].includes(userState.roleType) && hasNoAuthority(userState)) {
          return this.router.parseUrl('dashboard');
        }

        if (
          shouldShowDisabled(userState) ||
          hasNoAuthority(userState) ||
          shouldShowAccepted(userState) ||
          this.router.getCurrentNavigation()?.extras?.state?.addAnotherInstallation
        ) {
          return true;
        }

        return this.router.parseUrl('dashboard');
      }),
      first(),
    );
  }
}
