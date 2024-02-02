import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'esos-error-page',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <esos-page-heading>{{ heading }}</esos-page-heading>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  @Input() heading: string;
}
