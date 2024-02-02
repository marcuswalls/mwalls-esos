import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { EnergySavingsAchievedSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsAchieved } from 'esos-api';

import {
  ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
  EnergySavingsAchievedCurrentStep,
  EnergySavingsAchievedWizardStep,
} from '../energy-savings-achieved.helper';

interface ViewModel {
  data: EnergySavingsAchieved;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  queryParams: Params;
}

@Component({
  selector: 'esos-energy-savings-achieved-summary',
  templateUrl: './energy-savings-achieved-summary.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink, PageHeadingComponent, EnergySavingsAchievedSummaryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnergySavingsAchievedSummaryComponent {
  protected readonly wizardStep = EnergySavingsAchievedWizardStep;

  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationQuery.selectEnergySavingsAchieved)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[ENERGY_SAVINGS_ACHIEVED_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
    queryParams: { change: true },
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
