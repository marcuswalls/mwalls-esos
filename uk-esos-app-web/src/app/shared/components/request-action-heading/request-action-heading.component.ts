import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'esos-request-action-heading',
  template: `
    <esos-page-heading>{{ headerText }}</esos-page-heading>
    <p class="govuk-caption-m">{{ timelineCreationDate | govukDate: 'datetime' }}</p>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestActionHeadingComponent {
  @Input() headerText: string;
  @Input() timelineCreationDate: string;
}
