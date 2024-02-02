import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { CompliancePeriodsSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriod,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import {
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';

import { GovukComponentsModule } from 'govuk-components';

import { SecondCompliancePeriod } from 'esos-api';

interface ViewModel {
  subtaskTitle: string;
  subtaskName: string;
  data: SecondCompliancePeriod;
  isEditable: boolean;
  sectionsCompleted: NotificationTaskPayload['nocSectionsCompleted'];
  isFirstCompliancePeriod: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'esos-compliance-period-summary',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, PageHeadingComponent, RouterLink, CompliancePeriodsSummaryPageComponent],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompliancePeriodSummaryComponent {
  vm: Signal<ViewModel> = computed(() => ({
    subtaskTitle:
      this.subtask === CompliancePeriodSubtask.FIRST ? 'First compliance period' : 'Second compliance period',
    subtaskName:
      this.subtask === CompliancePeriodSubtask.FIRST ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
    data:
      this.subtask === CompliancePeriodSubtask.FIRST
        ? this.store.select(notificationQuery.selectFirstCompliancePeriod)()
        : this.store.select(notificationQuery.selectSecondCompliancePeriod)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    sectionsCompleted: this.store.select(notificationQuery.selectNocSectionsCompleted)(),
    isFirstCompliancePeriod: this.subtask === CompliancePeriodSubtask.FIRST,
    wizardStep: WizardStep,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask:
        this.subtask === CompliancePeriodSubtask.FIRST ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
