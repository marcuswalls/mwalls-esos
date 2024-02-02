import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ReportingObligationSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { ReportingObligation } from 'esos-api';

import { notificationQuery } from '../../../+state/notification.selectors';
import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';

type ViewModel = {
  data: ReportingObligation;
  isEditable: boolean;
  status: TaskItemStatus;
};

@Component({
  selector: 'esos-reporting-obligation-summary',
  standalone: true,
  imports: [NgIf, ButtonDirective, ReportingObligationSummaryPageComponent, PageHeadingComponent],
  templateUrl: './reporting-obligation-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSummaryComponent {
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;
  protected vm: Signal<ViewModel> = computed(() => {
    const data = this.store.select(notificationQuery.selectReportingObligation)();
    const isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
    const status = this.store.select(notificationQuery.selectStatusForSubtask(REPORTING_OBLIGATION_SUBTASK))();

    return { data, isEditable, status };
  });

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.submitSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
      applySideEffects: true,
    });
  }
}
