import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { LeadAssessorDetailsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { LeadAssessor } from 'esos-api';

import { LEAD_ASSESSOR_DETAILS_SUB_TASK, LeadAssessorDetailsCurrentStep, LeadAssessorDetailsWizardStep } from '../lead-assessor-details.helper';

interface ViewModel {
  subtaskName: string;
  data: LeadAssessor;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
}

@Component({
  selector: 'esos-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    LeadAssessorDetailsSummaryPageComponent,
    PendingButtonDirective,
    ButtonDirective,
    NgIf,
  ],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SummaryComponent {
  wizardStep = LeadAssessorDetailsWizardStep;

  vm: Signal<ViewModel> = computed(() => ({
    subtaskName: LEAD_ASSESSOR_DETAILS_SUB_TASK,
    data: this.store.select(notificationQuery.selectLeadAssessor)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[LEAD_ASSESSOR_DETAILS_SUB_TASK] === TaskItemStatus.COMPLETED,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: LEAD_ASSESSOR_DETAILS_SUB_TASK,
      currentStep: LeadAssessorDetailsCurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
