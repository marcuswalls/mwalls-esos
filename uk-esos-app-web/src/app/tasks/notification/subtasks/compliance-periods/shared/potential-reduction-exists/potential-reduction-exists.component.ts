import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import {
  CurrentStep,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { potentialReductionExistsFormProvider } from '@tasks/notification/subtasks/compliance-periods/shared/potential-reduction-exists/potential-reduction-exists-form.provider';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

import { COMPLIANCE_PERIOD_SUB_TASK, CompliancePeriod, CompliancePeriodSubtask } from '../../compliance-period.token';

@Component({
  selector: 'esos-energy-measures-exist',
  templateUrl: './potential-reduction-exists.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioOptionComponent, WizardStepComponent, RadioComponent],
  providers: [potentialReductionExistsFormProvider],
})
export class PotentialReductionExistsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isFirstCompliancePeriod: boolean;
  heading: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    @Inject(TASK_FORM) private readonly potentialReductionExistsForm: UntypedFormGroup,
    @Inject(COMPLIANCE_PERIOD_SUB_TASK) private readonly subtask: CompliancePeriod,
  ) {
    this.formGroup = this.potentialReductionExistsForm;
  }

  ngOnInit(): void {
    this.isFirstCompliancePeriod = this.subtask === CompliancePeriodSubtask.FIRST;
    this.heading = WIZARD_STEP_HEADINGS[WizardStep.POTENTIAL_REDUCTION_EXISTS](this.isFirstCompliancePeriod);
  }

  submit(): void {
    this.service.saveSubtask({
      subtask: this.isFirstCompliancePeriod ? CompliancePeriodSubtask.FIRST : CompliancePeriodSubtask.SECOND,
      currentStep: CurrentStep.POTENTIAL_REDUCTION_EXISTS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (this.isFirstCompliancePeriod) {
          payload.noc.firstCompliancePeriod.firstCompliancePeriodDetails.potentialReductionExists =
            this.formGroup.value.potentialReductionExists;
        } else {
          payload.noc.secondCompliancePeriod.firstCompliancePeriodDetails.potentialReductionExists =
            this.formGroup.value.potentialReductionExists;
        }
      }),
    });
  }
}
