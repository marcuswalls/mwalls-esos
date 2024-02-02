import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { first, map, Observable, withLatestFrom } from 'rxjs';

import { AuthStore, selectUserRoleType, selectUserState } from '@core/store/auth';
import { hasNoAuthority, loginEnabled } from '@core/util/user-status-util';

@Injectable({
  providedIn: 'root',
})
export class InstallationAuthGuard implements CanActivate {
  constructor(private store: AuthStore, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.pipe(selectUserState).pipe(
      first(),
      withLatestFrom(this.store.pipe(selectUserRoleType)),
      map(([userState, role]) => {
        if (loginEnabled(userState) || (hasNoAuthority(userState) && ['REGULATOR'].includes(role))) {
          return true;
        }
        return this.router.parseUrl('landing');
      }),
    );
  }
}
