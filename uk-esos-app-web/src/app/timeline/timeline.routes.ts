import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import {
  canActivateRequestActionPage,
  canDeactivateRequestActionPage,
} from '@common/request-action/request-action.guards';
import { REQUEST_ACTION_PAGE_CONTENT } from '@common/request-action/request-action.providers';
import { ActionTypeToBreadcrumbPipe } from '@shared/pipes/action-type-to-breadcrumb.pipe';

import { timelineContent } from './timeline.content';

export const TIMELINE_ROUTES: Routes = [
  {
    path: ':actionId',
    data: { breadcrumb: ({ type }) => new ActionTypeToBreadcrumbPipe().transform(type) },
    resolve: { type: () => inject(RequestActionStore).select(requestActionQuery.selectActionType)() },
    providers: [{ provide: REQUEST_ACTION_PAGE_CONTENT, useValue: timelineContent }],
    canActivate: [canActivateRequestActionPage],
    canDeactivate: [canDeactivateRequestActionPage],
    children: [
      {
        path: '',
        loadChildren: () => import('@common/request-action/request-action.routes').then((r) => r.ROUTES),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./notification/notification-timeline.routes').then((r) => r.NOTIFICATION_TIMELINE_ROUTES),
      },
    ],
  },
];
