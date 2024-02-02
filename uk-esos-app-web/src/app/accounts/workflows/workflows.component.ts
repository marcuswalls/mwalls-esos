import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { EsosAccount } from '@core/store/auth';
import { originalOrder } from '@shared/keyvalue-order';

import {
  OrganisationAccountDTO,
  RequestDetailsDTO,
  RequestDetailsSearchResults,
  RequestSearchByAccountCriteria,
  RequestsService,
} from 'esos-api';

import { statusesTagMap } from '../shared/statusesTagMap';
import { workflowTypesDomainMap } from './workflowTypesMap';

@Component({
  selector: 'esos-workflows',
  templateUrl: './workflows.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowsComponent implements OnInit {
  @Input() currentTab: string;

  readonly originalOrder = originalOrder;
  readonly workflowStatusesTagMap = statusesTagMap;

  readonly pageSize = 30;
  page$ = new BehaviorSubject<number>(1);

  accountId$: Observable<number>;
  workflowResults$: Observable<RequestDetailsSearchResults>;
  showPagination$ = new BehaviorSubject<boolean>(true);

  private searchTypes$ = new BehaviorSubject<RequestDetailsDTO['requestType'][]>([]);
  private searchStatuses$ = new BehaviorSubject<RequestSearchByAccountCriteria['requestStatuses'][]>([]);

  constructor(private readonly route: ActivatedRoute, private readonly requestsService: RequestsService) {}

  ngOnInit(): void {
    this.accountId$ = (
      this.route.data as Observable<{
        data: OrganisationAccountDTO;
      }>
    ).pipe(map((account) => account.data.id));

    this.workflowResults$ = combineLatest([
      this.accountId$,
      this.searchTypes$,
      this.searchStatuses$,
      this.page$.pipe(distinctUntilChanged()),
    ]).pipe(
      switchMap(([accountId, types, statuses, page]) =>
        this.requestsService.getRequestDetailsByAccountId({
          accountId: accountId,
          category: 'PERMIT',
          requestTypes: types.reduce((acc, val) => acc.concat(val), []),
          requestStatuses: statuses.reduce((acc, val) => acc.concat(val), []),
          pageNumber: page - 1,
          pageSize: this.pageSize,
        }),
      ),
      tap((workflows) => {
        this.showPagination$.next(workflows.total > this.pageSize);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  workflowName(requestType: RequestDetailsDTO['requestType']): string {
    return Object.entries(workflowTypesDomainMap[EsosAccount]).find((e) => e[1].includes(requestType))?.[0];
  }
}
