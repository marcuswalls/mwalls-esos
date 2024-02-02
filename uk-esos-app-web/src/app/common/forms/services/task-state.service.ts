import { inject } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';

import { RequestTaskPayload } from 'esos-api';

export abstract class TaskStateService<T extends RequestTaskPayload> {
  protected readonly store = inject(RequestTaskStore);

  abstract get payload(): T;

  abstract get stagedChanges(): T;

  abstract stageForSave(payload: T): void;

  abstract setPayload(payload: T): void;
}
