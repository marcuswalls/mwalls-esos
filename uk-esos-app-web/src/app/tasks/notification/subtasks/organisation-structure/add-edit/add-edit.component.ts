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

import { HelpContentComponent } from '../help-content/help-content.component';
import { ORGANISATION_STRUCTURE_SUB_TASK, OrganisationStructureCurrentStep } from '../organisation-structure.helper';
import { addEditFormProvider } from './add-edit-form.provider';

@Component({
  selector: 'esos-organisation-structure-add-edit',
  standalone: true,
  imports: [HelpContentComponent, SharedModule, WizardStepComponent],
  templateUrl: './add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [addEditFormProvider],
})
export class OrganisationStructureAddEditComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private store: RequestTaskStore,
  ) {}

  submit() {
    const index = +this.route.snapshot.params.index;

    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: index ? OrganisationStructureCurrentStep.EDIT : OrganisationStructureCurrentStep.ADD,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const organisations = payload.noc.organisationStructure.organisationsAssociatedWithRU;

        const newPayload = !index
          ? [...(organisations ?? []), this.form.value]
          : organisations.map((organisation, i) => (i === index - 1 ? this.form.value : organisation));

        payload.noc.organisationStructure.organisationsAssociatedWithRU = newPayload;
      }),
    });
  }
}
