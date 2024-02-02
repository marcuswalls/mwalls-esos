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
import { primaryContactDetailsFormProvider } from './primary-contact-details-form.provider';

@Component({
  selector: 'esos-contact-persons-primary-details',
  standalone: true,
  imports: [SharedModule, WizardStepComponent],
  templateUrl: './primary-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [primaryContactDetailsFormProvider],
})
export class PrimaryContactDetailsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private store: RequestTaskStore,
  ) {}

  submit() {
    this.service.saveSubtask({
      subtask: CONTACT_PERSONS_SUB_TASK,
      currentStep: ContactPersonsCurrentStep.PRIMARY_CONTACT,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        if (!payload.noc.contactPersons) {
          payload.noc.contactPersons = {} as any;
        }
        payload.noc.contactPersons.primaryContact = removeAddressProperty(this.form.value);
      }),
    });
  }
}
