import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { LEAD_ASSESSOR_DETAILS_SUB_TASK,LeadAssessorDetailsCurrentStep } from '../lead-assessor-details.helper';
import { HelpMeComponent } from './help-me/help-me.component';
import { LeadAssessorRequirementsFormProvider } from './lead-assessor-requirements-form.provider';

@Component({
  selector: 'esos-lead-assessor-requirements',
  templateUrl: './lead-assessor-requirements.component.html',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, HelpMeComponent],
  providers: [LeadAssessorRequirementsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadAssessorRequirementsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  constructor(
    @Inject(REQUEST_TASK_PAGE_CONTENT) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: LEAD_ASSESSOR_DETAILS_SUB_TASK,
      currentStep: LeadAssessorDetailsCurrentStep.REQUIREMENTS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.leadAssessor = {
          ...payload.noc.leadAssessor,
          hasLeadAssessorConfirmation: this.form.controls.hasLeadAssessorConfirmation.value,
        };
      }),
    });
  }
}
