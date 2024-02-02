import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { catchError, map, of } from 'rxjs';

import { RequestActionStore } from '@common/request-action/+state';

import { RequestActionsService } from 'esos-api';

export const canActivateRequestActionPage: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const store = inject(RequestActionStore);
  const service = inject(RequestActionsService);

  const id = +route.paramMap.get('actionId');
  if (!route.paramMap.has('actionId') || Number.isNaN(id)) {
    console.warn('No :actionId param in route');
    return true;
  }

  return service.getRequestActionById(id).pipe(
    map((action) => {
      store.setAction(action);
      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['dashboard']));
    }),
  );
};

export const canDeactivateRequestActionPage: CanDeactivateFn<unknown> = () => {
  inject(RequestActionStore).reset();
  return true;
};
