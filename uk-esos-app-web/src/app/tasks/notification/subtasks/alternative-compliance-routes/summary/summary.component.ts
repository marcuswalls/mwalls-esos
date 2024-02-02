import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { AlternativeComplianceRoutesSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { TaskItemStatus } from '@tasks/task-item-status';

import { ButtonDirective } from 'govuk-components';

import { AlternativeComplianceRoutes } from 'esos-api';

interface ViewModel {
  data: AlternativeComplianceRoutes;
  isEditable: boolean;
  queryParams: Params;
  isSubTaskCompleted: boolean;
  alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes>;
}

@Component({
  selector: 'esos-summary',
  standalone: true,
  imports: [NgIf, ButtonDirective, PageHeadingComponent, AlternativeComplianceRoutesSummaryPageComponent],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  protected readonly wizardStep = WizardStep;

  vm: Signal<ViewModel> = computed(() => ({
    data: this.store.select(notificationQuery.selectAlternativeComplianceRoutes)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    queryParams: { change: true },
    isSubTaskCompleted:
      this.store.select(notificationQuery.selectNocSectionsCompleted)()[ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK] ===
      TaskItemStatus.COMPLETED,
    alternativeComplianceRoutesMap: alternativeComplianceRoutesMap,
  }));

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.submitSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
