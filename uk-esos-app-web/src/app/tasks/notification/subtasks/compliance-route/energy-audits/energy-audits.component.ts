import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { EnergyAuditListComponent } from '@shared/components/energy-audit-list/energy-audit-list.component';
import { EnergyAuditListViewModel } from '@shared/components/energy-audit-list/energy-audit-list.types';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep, WizardStep } from '../compliance-route.helper';
import { energyAuditsFormProvider } from './energy-audits-form.provider';

@Component({
  selector: 'esos-energy-audits',
  standalone: true,
  templateUrl: './energy-audits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule, WizardStepComponent, EnergyAuditListComponent],
  providers: [energyAuditsFormProvider],
})
export class EnergyAuditsComponent {
  vm: Signal<EnergyAuditListViewModel> = computed(() => ({
    header: 'Energy audits added',
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    prefix: '../',
    wizardStep: WizardStep,
  }));
  complianceRoute = this.store.select(notificationQuery.selectComplianceRoute);

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: RequestTaskStore,
  ) {}

  addEnergyAudit() {
    this.router.navigate(['../', WizardStep.ADD_ENERGY_AUDIT], { relativeTo: this.route });
  }

  removeEnergyAudit(index: number) {
    const energyAudits = this.store
      .select(notificationQuery.selectComplianceRoute)()
      .energyAudits.filter((_, i) => i !== index);

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.REMOVE_ENERGY_AUDIT,
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
    const energyAudits = this.store.select(notificationQuery.selectComplianceRoute)().energyAudits ?? [];

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: CurrentStep.ENERGY_AUDITS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.complianceRoute.energyAudits = energyAudits;
      }),
    });
  }
}
