import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { selectUserRoleType } from '@core/store/auth/auth.selectors';
import { AuthStore } from '@core/store/auth/auth.store';

import { OrganisationAccountDTO } from 'esos-api';

@Component({
  selector: 'esos-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  accountDetails$ = (
    this.route.data as Observable<{
      data: OrganisationAccountDTO;
    }>
  ).pipe(map((account) => account.data));
  userRoleType$ = this.store.pipe(selectUserRoleType);
  currentTab$ = new BehaviorSubject<string>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    readonly location: Location,
    readonly store: AuthStore,
  ) {}

  selectedTab(selected: string) {
    // upon pagination queryParams is shown, for example "?page=3". In order to avoid any bug from navigation to tabs, clear query params.
    this.router.navigate([], {
      relativeTo: this.route,
      preserveFragment: true,
    });
    this.currentTab$.next(selected);
  }
}
