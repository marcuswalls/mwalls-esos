import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { COMPLIANCE_ROUTE_SUB_TASK, CurrentStep } from '../compliance-route.helper';
import { addEnergyAuditFormProvider } from './add-energy-audit-form.provider';

@Component({
  selector: 'esos-add-energy-audit',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  providers: [addEnergyAuditFormProvider],
  templateUrl: './add-energy-audit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEnergyAuditComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  submit() {
    const index = +this.route.snapshot.params.index;

    this.service.saveSubtask({
      subtask: COMPLIANCE_ROUTE_SUB_TASK,
      currentStep: index ? CurrentStep.EDIT_ENERGY_AUDIT : CurrentStep.ADD_ENERGY_AUDIT,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const energyAudits = payload.noc?.complianceRoute?.energyAudits;

        const newPayload = !index
          ? [...(energyAudits ?? []), this.form.value]
          : energyAudits.map((energyAudit, i) => (i === index - 1 ? this.form.value : energyAudit));

        payload.noc.complianceRoute.energyAudits = newPayload;
      }),
    });
  }
}
