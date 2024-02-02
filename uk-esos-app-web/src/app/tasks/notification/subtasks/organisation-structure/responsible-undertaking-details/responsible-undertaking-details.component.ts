import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { HelpContentComponent } from '../help-content/help-content.component';
import { ORGANISATION_STRUCTURE_SUB_TASK, OrganisationStructureCurrentStep } from '../organisation-structure.helper';
import { responsibleUndertakingDetailsFormProvider } from './responsible-undertaking-details-form.provider';

@Component({
  selector: 'esos-organisation-structure-responsible-undertaking-details',
  standalone: true,
  imports: [HelpContentComponent, SharedModule, WizardStepComponent],
  templateUrl: './responsible-undertaking-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [responsibleUndertakingDetailsFormProvider],
})
export class ResponsibleUndertakingDetailsComponent {
  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: OrganisationStructureCurrentStep.RU_DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.organisationStructure = { ...payload.noc.organisationStructure, ...this.form.value };
      }),
    });
  }
}
