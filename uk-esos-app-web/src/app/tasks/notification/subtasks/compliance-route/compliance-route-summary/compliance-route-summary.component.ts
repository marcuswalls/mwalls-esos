import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ComplianceRouteSummaryPageComponent, ComplianceRouteViewModel } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep, WizardStep } from '../compliance-route.helper';

@Component({
  selector: 'esos-compliance-route-summary',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, ComplianceRouteSummaryPageComponent, RouterLink, PageHeadingComponent],
  templateUrl: './compliance-route-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceRouteSummaryComponent {
  vm: Signal<ComplianceRouteViewModel> = computed(() => ({
    subtaskName: COMPLIANCE_ROUTE_SUB_TASK,
    data: this.store.select(notificationQuery.selectComplianceRoute)(),
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    sectionsCompleted: this.store.select(notificationQuery.selectNocSectionsCompleted)(),
    wizardStep: WizardStep,
  }));
  complianceRoute = this.store.select(notificationQuery.selectComplianceRoute);

  constructor(
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  removeEnergyAuditSummary(index: number) {
    const energyAudits = this.store
      .select(notificationQuery.selectComplianceRoute)()
      .energyAudits.filter((_, i) => i !== index);

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.REMOVE_ENERGY_AUDIT_SUMMARY,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute = {
          ...payload.noc.complianceRoute,
          energyAudits,
        };
      }),
    });
  }

  submit() {
    this.service.submitSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.SUMMARY,
      route: this.route,
      payload: this.service.payload,
    });
  }
}
