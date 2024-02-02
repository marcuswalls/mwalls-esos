import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { first, map, Observable, switchMap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { loginDisabled } from '@core/util/user-status-util';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(protected router: Router, protected authService: AuthService, private store: AuthStore) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkUser().pipe(
      switchMap(() => this.store),
      map(({ isLoggedIn, userState, terms, user }) =>
        isLoggedIn && terms.version === user.termsVersion && !loginDisabled(userState)
          ? (true as const)
          : isLoggedIn && terms.version !== user.termsVersion
          ? this.router.parseUrl('/terms')
          : this.router.parseUrl('landing'),
      ),
      first(),
    );
  }
}
