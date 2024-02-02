import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Resolve } from '@angular/router';

import { first, map, Observable, tap } from 'rxjs';

import { OrganisationAccountDTO, OrganisationAccountViewService } from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class AccountGuard implements CanActivate, CanDeactivate<any>, Resolve<OrganisationAccountDTO> {
  account: OrganisationAccountDTO;

  constructor(private readonly accountViewService: OrganisationAccountViewService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.accountViewService.getOrganisationAccountById(Number(route.paramMap.get('accountId'))).pipe(
      first(),
      tap((account) => (this.account = account)),
      map((account) => !!account.name),
    );
  }

  canDeactivate(): boolean {
    return true;
  }

  resolve(): OrganisationAccountDTO {
    return this.account;
  }
}
