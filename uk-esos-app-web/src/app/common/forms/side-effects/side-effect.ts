import { inject } from '@angular/core';

import { RequestTaskPayload } from 'esos-api';

import { RequestTaskStore } from '../../request-task/+state';

/**
 * Simple handler class for applying side effects to a task's state based on changes in a specific subtask.
 */
export abstract class SideEffect {
  abstract subtask: string;
  step = null;
  protected store = inject(RequestTaskStore);

  /**
   * Handle task-wide side effects triggered by the saving of a subtask
   */
  abstract apply<T extends RequestTaskPayload>(payload: T): T;
}
