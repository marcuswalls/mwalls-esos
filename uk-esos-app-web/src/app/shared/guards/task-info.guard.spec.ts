import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, of } from 'rxjs';

import { ActivatedRouteSnapshotStub, mockClass } from '@testing';

import { RequestTaskItemDTO, TasksService } from 'esos-api';

import { TaskInfoGuard } from './task-info.guard';

describe('TaskInfoGuard', () => {
  let guard: TaskInfoGuard;
  const info: RequestTaskItemDTO = {
    allowedRequestTaskActions: ['ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION'],
  };
  const tasksService = mockClass(TasksService);
  tasksService.getTaskItemInfoById.mockReturnValue(of(info));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: TasksService, useValue: tasksService }],
    });
    guard = TestBed.inject(TaskInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate and set info', async () => {
    await expect(
      lastValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ taskId: '123' }))),
    ).resolves.toBeTruthy();
    expect(guard.resolve()).toEqual(info);
  });
});
