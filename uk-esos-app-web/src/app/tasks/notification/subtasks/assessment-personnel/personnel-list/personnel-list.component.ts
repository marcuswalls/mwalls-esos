import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PersonnelListTemplateComponent } from '@shared/components/personnel-list-template/personnel-list-template.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { PersonnelDetails } from 'esos-api';

import {
  ASSESSMENT_PERSONNEL_SUB_TASK,
  AssessmentPersonnelCurrentStep,
  AssessmentPersonnelWizardStep,
} from '../assessment-personnel.helper';
import { PersonListFormProvider } from './personnel-list-form.provider';

@Component({
  selector: 'esos-personnel-list',
  templateUrl: './personnel-list.component.html',
  standalone: true,
  imports: [GovukComponentsModule, WizardStepComponent, RouterLink, PersonnelListTemplateComponent],
  providers: [PersonListFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonnelListComponent {
  wizardStep = AssessmentPersonnelWizardStep;

  get personnel() {
    return this.form.get('personnel').value as PersonnelDetails[];
  }

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ASSESSMENT_PERSONNEL_SUB_TASK,
      currentStep: AssessmentPersonnelCurrentStep.LIST,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.assessmentPersonnel = this.form.value;
      }),
    });
  }
}
