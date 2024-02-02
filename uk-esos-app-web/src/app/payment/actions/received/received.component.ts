import { ChangeDetectionStrategy, Component } from '@angular/core';

import { map } from 'rxjs';

import { shouldHidePaymentAmount } from '../../core/utils';
import { PaymentStore } from '../../store/payment.store';

@Component({
  selector: 'esos-received',
  template: `
    <ng-container *ngIf="store | async as state">
      <esos-request-action-heading
        headerText="Payment marked as received"
        [timelineCreationDate]="state.requestActionCreationDate"
      >
      </esos-request-action-heading>
      <esos-payment-summary [details]="details$ | async" [shouldDisplayAmount]="shouldDisplayAmount$ | async">
        <h2 esos-summary-header class="govuk-heading-m">Details</h2>
      </esos-payment-summary>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceivedComponent {
  readonly shouldDisplayAmount$ = this.store.pipe(map((state) => !shouldHidePaymentAmount(state)));

  constructor(readonly store: PaymentStore) {}
  details$ = this.store.pipe(
    map((state: any) => {
      return { ...state.actionPayload, amount: +state.actionPayload.amount };
    }),
  );
}
