import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-submission-task-buttons',
  standalone: true,
  imports: [ButtonDirective, NgIf, RouterLink],
  template: `
    <div class="govuk-button-group" *ngIf="isEditable()">
      <a govukSecondaryButton [routerLink]="['notification', 'send-for-review']">Send for review</a>
      <a
        govukButton
        [routerLink]="isSectionsCompleted() ? ['notification', 'submit'] : []"
        [attr.disabled]="isSectionsCompleted() ? null : ''"
      >
        Submit to regulator
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionTaskButtonsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  isSectionsCompleted = this.store.select(notificationQuery.selectCanSubmitNoc);

  constructor(readonly store: RequestTaskStore) {}
}
