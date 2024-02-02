import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { EnergySavingsOpportunitiesSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { EnergySavingsOpportunities } from 'esos-api';

import { CurrentStep, ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK, WizardStep } from '../energy-savings-opportunity.helper';

interface ViewModel {
  data: EnergySavingsOpportunities;
  isEditable: boolean;
  queryParams: Params;
  changeLink: { [s: string]: string };
  isSubTaskCompleted: boolean;
}

@Component({
  selector: 'esos-energy-savings-opportunity-summary',
  standalone: true,
  imports: [NgIf, PageHeadingComponent, JsonPipe, ButtonDirective, EnergySavingsOpportunitiesSummaryPageComponent],
  templateUrl: './energy-savings-opportunity-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsOpportunitySummaryComponent {
  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationQuery.selectEnergySavingsOpportunities)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    queryParams: { change: true },
    changeLink: WizardStep,
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: ENERGY_SAVINGS_OPPORTUNITIES_SUB_TASK,
      currentStep: CurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
