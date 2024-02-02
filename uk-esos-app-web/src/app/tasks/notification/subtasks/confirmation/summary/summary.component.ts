import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ConfirmationSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { Confirmations } from 'esos-api';

import { CONFIRMATIONS_SUB_TASK, CurrentStep, WizardStep } from '../confirmation.helper';

interface ViewModel {
  subtaskName: string;
  data: Confirmations;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
}

@Component({
  selector: 'esos-summary',
  standalone: true,
  imports: [PageHeadingComponent, ConfirmationSummaryPageComponent, PendingButtonDirective, ButtonDirective, NgIf],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SummaryComponent {
  wizardStep = WizardStep;

  vm: Signal<ViewModel> = computed(() => {
    const isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
    const confiramtion = this.store.select(notificationQuery.selectConfirmation)();
    const isSubTaskCompleted =
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[CONFIRMATIONS_SUB_TASK] ===
      TaskItemStatus.COMPLETED;

    return {
      subtaskName: CONFIRMATIONS_SUB_TASK,
      data: confiramtion,
      isEditable,
      isSubTaskCompleted,
    };
  });

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: CONFIRMATIONS_SUB_TASK,
      currentStep: CurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
