import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-notification-submit-action',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent],
  template: `
    <esos-page-heading size="xl"> Submit to regulator </esos-page-heading>

    <p class="govuk-body">
      Your notification will be sent directly to your regulator.
      <br />
      <br />
      By selecting 'Confirm and send' you confirm that the information in your notification is correct to the best of
      your knowledge.
    </p>

    <div class="govuk-button-group">
      <button type="button" appPendingButton (click)="submit()" govukButton>Confirm and send</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSubmitActionComponent {
  constructor(private readonly service: TaskService<NotificationTaskPayload>, readonly route: ActivatedRoute) {}

  submit() {
    this.service.submit({
      subtask: 'submit',
      currentStep: 'action',
      route: this.route,
    });
  }
}
