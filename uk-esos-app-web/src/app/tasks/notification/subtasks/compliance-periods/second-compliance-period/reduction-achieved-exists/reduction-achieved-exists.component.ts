import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { reductionAchievedExistsFormProvider } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/reduction-achieved-exists/reduction-achieved-exists-form.provider';
import {
  CurrentStep,
  SUB_TASK_SECOND_COMPLIANCE_PERIOD,
  WizardStep,
} from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent } from 'govuk-components';

@Component({
  selector: 'esos-reduction-achieved-exists',
  templateUrl: './reduction-achieved-exists.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RadioOptionComponent, WizardStepComponent, RadioComponent],
  providers: [reductionAchievedExistsFormProvider],
})
export class ReductionAchievedExistsComponent {
  formGroup: UntypedFormGroup;
  heading: string = WIZARD_STEP_HEADINGS[WizardStep.REDUCTION_ACHIEVED_EXISTS](false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: TaskService<NotificationTaskPayload>,
    @Inject(TASK_FORM) private readonly reductionAchievedExistsForm: UntypedFormGroup,
  ) {
    this.formGroup = this.reductionAchievedExistsForm;
  }

  submit(): void {
    this.service.saveSubtask({
      subtask: SUB_TASK_SECOND_COMPLIANCE_PERIOD,
      currentStep: CurrentStep.REDUCTION_ACHIEVED_EXISTS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.secondCompliancePeriod = {
          ...payload.noc.secondCompliancePeriod,
          reductionAchievedExists: this.formGroup.value.reductionAchievedExists,
        };
      }),
    });
  }
}
