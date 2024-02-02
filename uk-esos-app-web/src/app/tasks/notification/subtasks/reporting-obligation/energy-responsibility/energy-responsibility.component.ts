import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';
import { EnergyResponsibilityFormModel, energyResponsibilityFormProvider } from './energy-responsibility-form.provider';

@Component({
  selector: 'esos-energy-responsibility',
  standalone: true,
  imports: [WizardStepComponent, FormsModule, RadioComponent, RadioOptionComponent, ReactiveFormsModule],
  templateUrl: './energy-responsibility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [energyResponsibilityFormProvider],
})
export class EnergyResponsibilityComponent {
  protected isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;

  constructor(
    @Inject(TASK_FORM) protected readonly form: FormGroup<EnergyResponsibilityFormModel>,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.ENERGY_RESPONSIBILITY,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const er = this.form.value.energyResponsibility;

        if (er === 'NOT_RESPONSIBLE') {
          delete payload.noc.reportingObligation.reportingObligationDetails.complianceRouteDistribution;
        }

        payload.noc.reportingObligation.reportingObligationDetails.energyResponsibilityType =
          this.form.value.energyResponsibility;
      }),
      applySideEffects: false,
    });
  }
}
