import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { canActivateRequestTaskPage, canDeactivateRequestTaskPage } from '@common/request-task/request-task.guards';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { TaskTypeToBreadcrumbPipe } from '@shared/pipes/task-type-to-breadcrumb.pipe';

import { tasksContent } from './tasks-content';

export const TASKS_ROUTES: Routes = [
  {
    path: ':taskId',
    data: { breadcrumb: ({ type }) => new TaskTypeToBreadcrumbPipe().transform(type) },
    resolve: { type: () => inject(RequestTaskStore).state.requestTaskItem.requestTask.type },
    canActivate: [canActivateRequestTaskPage],
    canDeactivate: [canDeactivateRequestTaskPage],
    children: [
      {
        path: '',
        providers: [
          {
            provide: REQUEST_TASK_PAGE_CONTENT,
            useValue: tasksContent,
          },
        ],
        loadChildren: () => import('@common/request-task').then((r) => r.REQUEST_TASK_ROUTES),
      },
      {
        path: 'timeline',
        loadChildren: () => import('@timeline/timeline.routes').then((r) => r.TIMELINE_ROUTES),
      },
      {
        path: 'organisation-account-application-review',
        loadChildren: () =>
          import('./organisation-account-application-review/organisation-account-application-review.routes').then(
            (r) => r.ROUTES,
          ),
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.routes').then((r) => r.NOTIFICATION_ROUTES),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
];
