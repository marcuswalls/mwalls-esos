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

import { CONTACT_PERSONS_SUB_TASK, ContactPersonsCurrentStep, removeAddressProperty } from '../contact-persons.helper';
import { secondaryContactDetailsFormProvider } from './secondary-contact-details-form.provider';

@Component({
  selector: 'esos-contact-persons-secondary-details',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './secondary-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [secondaryContactDetailsFormProvider],
})
export class SecondaryContactDetailsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: CONTACT_PERSONS_SUB_TASK,
      currentStep: ContactPersonsCurrentStep.SECONDARY_CONTACT,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.contactPersons.secondaryContact = removeAddressProperty(this.form.value);
      }),
    });
  }
}
