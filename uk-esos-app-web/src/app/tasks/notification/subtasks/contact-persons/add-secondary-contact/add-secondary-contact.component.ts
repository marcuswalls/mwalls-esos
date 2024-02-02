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

import { CONTACT_PERSONS_SUB_TASK, ContactPersonsCurrentStep } from '../contact-persons.helper';
import { addSecondaryContactFormProvider } from './add-secondary-contact-form.provider';

@Component({
  selector: 'esos-contact-persons-add-secondary-contact',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './add-secondary-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [addSecondaryContactFormProvider],
})
export class AddSecondaryContactComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private store: RequestTaskStore,
  ) {}

  submit() {
    const hasSecondaryContact = this.form.value.hasSecondaryContact;

    this.service.saveSubtask({
      subtask: CONTACT_PERSONS_SUB_TASK,
      currentStep: ContactPersonsCurrentStep.ADD_SECONDARY_CONTACT,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.contactPersons.hasSecondaryContact = hasSecondaryContact;
      }),
    });
  }
}
