import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, UrlTree } from '@angular/router';

import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { isBadRequest } from '@error/business-errors';

import { InvitedUserInfoDTO, RegulatorUsersRegistrationService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class RegulatorInvitationGuard implements CanActivate, Resolve<InvitedUserInfoDTO> {
  private invitedUser: InvitedUserInfoDTO;

  constructor(
    private readonly router: Router,
    private readonly regulatorUsersRegistrationService: RegulatorUsersRegistrationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const token = route.queryParamMap.get('token');

    return token
      ? this.regulatorUsersRegistrationService.acceptRegulatorInvitation({ token }).pipe(
          tap((invitedUser) => (this.invitedUser = invitedUser)),
          map(() => true),
          catchError((res: unknown) => {
            if (isBadRequest(res)) {
              this.router.navigate(['invitation/regulator/invalid-link'], {
                queryParams: { code: res.error.code },
              });

              return of(false);
            } else {
              return throwError(() => res);
            }
          }),
        )
      : of(this.router.parseUrl('landing'));
  }

  resolve(): InvitedUserInfoDTO {
    return this.invitedUser;
  }
}
