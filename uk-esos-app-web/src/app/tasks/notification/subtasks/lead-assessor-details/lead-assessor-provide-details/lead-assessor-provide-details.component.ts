import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { REQUEST_TASK_PAGE_CONTENT } from '@common/request-task/request-task.providers';
import { ProfessionalBodyPipe } from '@shared/pipes/professional-body.pipe';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { LEAD_ASSESSOR_DETAILS_SUB_TASK,LeadAssessorDetailsCurrentStep } from '../lead-assessor-details.helper';
import { LeadAssessorProvideDetailsFormProvider } from './lead-assessor-provide-details-form.provider';

@Component({
  selector: 'esos-lead-assessor-provide-details',
  templateUrl: './lead-assessor-provide-details.component.html',
  standalone: true,
  imports: [SharedModule, WizardStepComponent, ProfessionalBodyPipe],
  providers: [LeadAssessorProvideDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadAssessorProvideDetailsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  professionalBodyPipe = new ProfessionalBodyPipe();

  professionalBodyTypes: any[] = [
    {
      text: this.professionalBodyPipe.transform('ASSOCIATION_OF_ENERGY_ENGINEERS'),
      value: 'ASSOCIATION_OF_ENERGY_ENGINEERS',
    },
    {
      text: this.professionalBodyPipe.transform('CIBSE_THE_CHARTERED_INSTITUTION_OF_BUILDING_SERVICES_ENGINEERS'),
      value: 'CIBSE_THE_CHARTERED_INSTITUTION_OF_BUILDING_SERVICES_ENGINEERS',
    },
    { text: this.professionalBodyPipe.transform('ELMHURST_ENERGY_SYSTEMS'), value: 'ELMHURST_ENERGY_SYSTEMS' },
    { text: this.professionalBodyPipe.transform('ENERGY_INSTITUTE'), value: 'ENERGY_INSTITUTE' },
    { text: this.professionalBodyPipe.transform('ENERGY_MANAGERS_ASSOCIATION'), value: 'ENERGY_MANAGERS_ASSOCIATION' },
    {
      text: this.professionalBodyPipe.transform('INSTITUTION_OF_CHEMICAL_ENGINEERS'),
      value: 'INSTITUTION_OF_CHEMICAL_ENGINEERS',
    },
    {
      text: this.professionalBodyPipe.transform('INSTITUTE_OF_ENVIRONMENTAL_MANAGEMENT_AND_ASSESSMENT'),
      value: 'INSTITUTE_OF_ENVIRONMENTAL_MANAGEMENT_AND_ASSESSMENT',
    },
    { text: this.professionalBodyPipe.transform('QUIDOS'), value: 'QUIDOS' },
    { text: this.professionalBodyPipe.transform('STROMA_CERTIFICATION_LTD'), value: 'STROMA_CERTIFICATION_LTD' },
  ];

  constructor(
    @Inject(REQUEST_TASK_PAGE_CONTENT) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: LEAD_ASSESSOR_DETAILS_SUB_TASK,
      currentStep: LeadAssessorDetailsCurrentStep.DETAILS,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.leadAssessor = {
          ...payload.noc.leadAssessor,
          leadAssessorDetails: this.form.value,
        };
      }),
    });
  }
}
