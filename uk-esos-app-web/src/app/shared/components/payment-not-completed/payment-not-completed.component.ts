import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-payment-not-completed',
  template: ` <esos-page-heading>The payment task must be closed before you can proceed</esos-page-heading> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentNotCompletedComponent {}
