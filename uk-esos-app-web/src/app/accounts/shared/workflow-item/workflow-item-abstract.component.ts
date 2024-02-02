import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, map } from 'rxjs';

import { UrlRequestType } from '@shared/types/url-request-type.type';

export abstract class WorkflowItemAbstractComponent {
  accountId$ = this.route.paramMap.pipe(
    map((paramMap) => (paramMap.get('accountId') ? Number(paramMap.get('accountId')) : null)),
  );
  requestType$ = this.route.data.pipe(map((data) => data.requestType as UrlRequestType));
  requestId$ = this.route.paramMap.pipe(map((paramMap) => paramMap.get('request-id')));
  prefixUrl$ = combineLatest([this.accountId$, this.requestType$]).pipe(
    map(([accountId, requestType]) => (accountId ? `accounts/${accountId}` : `workflows/${requestType}`)),
  );

  protected constructor(protected readonly router: Router, protected readonly route: ActivatedRoute) {}
}
