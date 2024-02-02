import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { significantEnergyConsumptionExistsFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/significant-energy-consumption-exists/significant-energy-consumption-exists-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-significant-energy-consumption-exists',
  templateUrl: './significant-energy-consumption-exists.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioOptionComponent, WizardStepComponent, RadioComponent, SharedModule],
  providers: [significantEnergyConsumptionExistsFormProvider],
})
export class SignificantEnergyConsumptionExistsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isFirstCompliancePeriod: boolean;
  heading: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    @Inject(TASK_FORM) private readonly significantEnergyConsumptionExistsForm: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {
    this.formGroup = this.significantEnergyConsumptionExistsForm;
  }

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS](this.isFirstCompliancePeriod);
  }

  submit(): void {
    if (this.formGroup.valid || this.formGroup.dirty) {
      this.service.saveSubtask({
        subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
        currentStep: CurrentStep.SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS,
        route: this.route,
        payload: produce(this.service.payload, (payload) => {
          if (this.isFirstCompliancePeriod) {
            payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails.significantEnergyConsumptionExists =
              this.formGroup.value.significantEnergyConsumptionExists;
          } else {
            payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails.significantEnergyConsumptionExists =
              this.formGroup.value.significantEnergyConsumptionExists;
          }
        }),
      });
    }
  }
}
