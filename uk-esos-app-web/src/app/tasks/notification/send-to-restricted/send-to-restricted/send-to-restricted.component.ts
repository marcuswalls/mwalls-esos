import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukComponentsModule } from 'govuk-components';

import { TasksAssignmentService } from 'esos-api';

import { sendNotificationFormProvider } from './send-to-restricted-form.provider';

type Option = {
  text: string;
  value: string;
};

@Component({
  selector: 'esos-send-to-restricted',
  standalone: true,
  imports: [PageHeadingComponent, WizardStepComponent, GovukComponentsModule, ReactiveFormsModule],
  templateUrl: './send-to-restricted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [sendNotificationFormProvider],
})
export class SendToRestrictedComponent {
  protected requestId = this.store.select(requestTaskQuery.selectRequestId);
  private requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
  protected candidateAssignees = toSignal(
    this.tasksAssignmentService
      .getCandidateAssigneesByTaskType(this.requestTaskId, 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT')
      .pipe(
        map((v) => {
          return v.map((item) => {
            return { text: `${item.firstName} ${item.lastName}`, value: item.id };
          });
        }),
      ),
  );

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly store: RequestTaskStore,
    private readonly tasksAssignmentService: TasksAssignmentService,
    private readonly service: TaskService<NotificationTaskPayload>,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {}

  private getTextByValue(options: Option[], participant: string): string {
    const matchedOption = options.find(option => option.value === participant);
    return matchedOption ? matchedOption.text : '';
  }

  submit() {
    (this.service as NotificationService).sendToRestricted({
      route: this.route,
      participant: {
        id: this.form.value?.user,
        fullName: this.getTextByValue(this.candidateAssignees(), this.form.value.user),
      },
    });
  }
}
