import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-invalid-code',
  template: `
    <esos-page-heading>Invalid code</esos-page-heading>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <p class="govuk-body">Invalid code. Please try again.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvalidCodeComponent {}
