import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { catchError, concatMap, map, of } from 'rxjs';

import { REQUEST_TASK_IS_EDITABLE_RESOLVER } from '@common/request-task/request-task.providers';
import { RequestTaskIsEditableResolver } from '@common/request-task/request-task.types';

import { RequestActionsService, RequestItemsService, TasksService } from 'esos-api';

import { RequestTaskStore } from './+state';

export const canActivateRequestTaskPage: CanActivateFn = (route) => {
  const router = inject(Router);
  const store = inject(RequestTaskStore);
  const tasksService = inject(TasksService);
  const requestActionsService = inject(RequestActionsService);
  const requestItemsService = inject(RequestItemsService);
  const editableResolver: RequestTaskIsEditableResolver = inject(REQUEST_TASK_IS_EDITABLE_RESOLVER);

  const id = +route.paramMap.get('taskId');
  if (!route.paramMap.has('taskId') || Number.isNaN(id)) {
    console.warn('No :taskId param in route');
    return true;
  }

  return tasksService.getTaskItemInfoById(id).pipe(
    concatMap((requestTaskItem) => {
      return requestActionsService
        .getRequestActionsByRequestId(requestTaskItem.requestInfo.id)
        .pipe(map((timeline) => ({ requestTaskItem, timeline })));
    }),
    concatMap(({ requestTaskItem, timeline }) => {
      return requestItemsService.getItemsByRequest(requestTaskItem.requestInfo.id).pipe(
        map(({ items: relatedTasks }) => {
          store.setRequestTaskItem(requestTaskItem);
          store.setTimeline(timeline);
          store.setRelatedTasks(relatedTasks);
          store.setIsEditable(editableResolver());

          return true;
        }),
      );
    }),
    catchError(() => {
      return of(router.createUrlTree(['dashboard']));
    }),
  );
};

export const canDeactivateRequestTaskPage: CanDeactivateFn<unknown> = () => {
  inject(RequestTaskStore).reset();
  return true;
};
