import { ChangeDetectionStrategy, Component } from '@angular/core';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ConfirmationSharedComponent } from '@shared/components/confirmation/confirmation.component';

@Component({
  selector: 'esos-return-to-submit-confirmation',
  standalone: true,
  imports: [ConfirmationSharedComponent],
  template: `
    <esos-confirmation-shared
      title="Notification has been returned"
      [whatHappensNextTemplate]="whatHappensNextTemplate"
      titleReferenceText="Your reference is"
      [titleReferenceId]="nocId"
    ></esos-confirmation-shared>

    <ng-template #whatHappensNextTemplate>
      <p class="govuk-body">The notification has been returned to the user responsible for submitting it.</p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToSubmitConfirmationComponent {
  nocId = this.store.select(requestTaskQuery.selectRequestId)();

  constructor(private readonly store: RequestTaskStore) {}
}
