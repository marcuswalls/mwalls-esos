import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { map, Observable } from 'rxjs';

import { OrganisationAccountViewService } from 'esos-api';

import { accountFinalStatuses } from '../../core/accountFinalStatuses';

@Injectable({
  providedIn: 'root',
})
export class AccountStatusGuard implements CanActivate {
  constructor(
    private readonly organisationAccountViewService: OrganisationAccountViewService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const accountId = Number(route.paramMap.get('accountId'));
    return this.organisationAccountViewService.getOrganisationAccountById(accountId).pipe(
      map((account) => {
        return accountFinalStatuses(account?.status) || this.router.parseUrl(`/accounts/${accountId}`);
      }),
    );
  }
}
