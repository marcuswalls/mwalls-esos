import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SaveConfig, TaskService } from '@common/forms/services/task.service';
import { StepFlowManager } from '@common/forms/step-flow';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { TaskItemStatus } from '@tasks/task-item-status';

import { NotificationTaskPayload, SendToRestrictedPayload } from '../notification.types';
import { NotificationApiService } from './notification-api.service';

export type NotificationSaveConfig = SaveConfig<NotificationTaskPayload>;

@Injectable()
export class NotificationService extends TaskService<NotificationTaskPayload> {
  private requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

  constructor(private readonly store: RequestTaskStore, protected readonly router: Router) {
    super();
  }

  saveSubtask(config: NotificationSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.IN_PROGRESS);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  get payload(): NotificationTaskPayload {
    return this.stateService.payload;
  }

  submitSubtask(config: NotificationSaveConfig): void {
    const { subtask, payload, currentStep, route, applySideEffects } = config;

    this.stageAndApplySideEffects(subtask, currentStep, payload, applySideEffects, TaskItemStatus.COMPLETED);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  returnToSubmit(config: NotificationSaveConfig) {
    const { subtask, currentStep, route } = config;

    this.apiService.returnToSubmit().subscribe(() => {
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  sendToRestricted(config: SendToRestrictedPayload) {
    const { participant, route } = config;

    (this.apiService as NotificationApiService)
      .sendToRestricted({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT',
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT_PAYLOAD',
          supportingOperator: participant.id,
        },
        requestTaskId: this.requestTaskId,
      })
      .subscribe(() => {
        this.router.navigate(['success'], {
          state: {
            participantFullName: participant.fullName,
          },
          relativeTo: route,
        });
      });
  }

  submit(config: NotificationSaveConfig): void {
    const { subtask, currentStep, route } = config;

    this.apiService.submit().subscribe(() => {
      this.flowManagerForSubtask(subtask)?.nextStep(currentStep, route);
    });
  }

  private stageAndApplySideEffects(
    subtask: string,
    step: string,
    payload: NotificationTaskPayload,
    applySideEffects: boolean,
    taskStatus: TaskItemStatus,
  ): void {
    const updatedPayload = {
      ...payload,
      nocSectionsCompleted: {
        ...payload?.nocSectionsCompleted,
        [subtask]: taskStatus,
      },
    };

    this.stateService.stageForSave(
      applySideEffects !== false ? this.sideEffects.apply(subtask, step, updatedPayload) : updatedPayload,
    );
  }

  private flowManagerForSubtask(subtask: string): StepFlowManager {
    const flowManager = this.stepFlowManagers.find((sfm) => sfm.subtask === subtask) ?? null;
    if (!flowManager) {
      console.error(`###NotificationService### :: Could not find StepFlowManager for subtask: ${subtask}`);
    }
    return flowManager;
  }
}
