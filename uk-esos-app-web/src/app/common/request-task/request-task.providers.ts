import { inject, InjectionToken } from '@angular/core';

import { AuthStore } from '@core/store';

import { requestTaskQuery, RequestTaskStore } from './+state';
import { RequestTaskIsEditableResolver, RequestTaskPageContentFactoryMap } from './request-task.types';

/**
 * @description
 * A map object whose keys are request task types and values are of type {@link RequestTaskPageContentFactory}
 * This is used to resolve the task page's content (sections, custom components etc.).
 * The factory function may optionally be passed an `injector` argument if it needs to use specific providers
 *
 * @see {RequestTaskPageContentFactoryMap}
 */
export const REQUEST_TASK_PAGE_CONTENT = new InjectionToken<RequestTaskPageContentFactoryMap>(
  'Request task page content',
);

/**
 * @description
 * An optional token used to customize the resolution of whether a task is editable or not.
 * By default, the page checks if current user is same as task assignee.
 * Use a custom provider if you want to customize behavior
 *
 * @see {RequestTaskIsEditableResolver}
 */
export const REQUEST_TASK_IS_EDITABLE_RESOLVER = new InjectionToken<RequestTaskIsEditableResolver>(
  'Request task isEditable resolver',
  {
    factory: () => {
      const store = inject(RequestTaskStore);
      const authStore = inject(AuthStore);

      return () => {
        const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
        const userId = authStore.getState().userState?.userId;
        return assigneeUserId === userId;
      };
    },
  },
);
