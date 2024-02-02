import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { EnergyConsumptionInputComponent } from '@shared/components/energy-consumption-input/energy-consumption-input.component';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
  isDecEnabled,
  isGdaEnabled,
  isIso50001Enabled,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import { assetsFormProvider } from '@tasks/notification/subtasks/alternative-compliance-routes/assets/assets-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { TextareaComponent } from 'govuk-components';

@Component({
  selector: 'esos-assets',
  standalone: true,
  imports: [EnergyConsumptionInputComponent, WizardStepComponent, ReactiveFormsModule, TextareaComponent, NgIf],
  templateUrl: './assets.component.html',
  providers: [assetsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsComponent {
  protected readonly alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
  protected readonly complianceRouteDistribution = this.store.select(notificationQuery.selectReportingObligation)()
    .reportingObligationDetails.complianceRouteDistribution;

  isIso50001Enabled = isIso50001Enabled(this.complianceRouteDistribution);
  isDecEnabled = isDecEnabled(this.complianceRouteDistribution);
  isGdaEnabled = isGdaEnabled(this.complianceRouteDistribution);

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
      currentStep: CurrentStep.ASSETS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.alternativeComplianceRoutes.assets = this.form.value;
      }),
    });
  }
}
