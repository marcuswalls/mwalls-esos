import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { RadioComponent, RadioOptionComponent, TextInputComponent } from 'govuk-components';

import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';
import { QualificationTypeFormModel, qualificationTypeFormProvider } from './qualification-type-form.provider';

@Component({
  selector: 'esos-qualification-type',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, WizardStepComponent, RadioOptionComponent, RadioComponent],
  templateUrl: './qualification-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [qualificationTypeFormProvider],
})
export class QualificationTypeComponent {
  protected isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;

  constructor(
    @Inject(TASK_FORM) protected readonly form: FormGroup<QualificationTypeFormModel>,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.QUALIFICATION_TYPE,
      payload: produce(this.service.payload, (payload) => {
        const qt = this.form.value.qualificationType;

        if (!payload.noc) {
          payload.noc = {} as any;
        }

        if (!payload.noc.reportingObligation) {
          payload.noc.reportingObligation = {} as any;
        }

        if (qt === 'NOT_QUALIFY') {
          delete payload.noc.reportingObligation.reportingObligationDetails;
        } else {
          delete payload.noc.reportingObligation.noQualificationReason;
        }

        payload.noc.reportingObligation.qualificationType = qt;
      }),
      route: this.route,
      applySideEffects: false,
    });
  }
}
