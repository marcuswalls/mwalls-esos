import { Component, Input } from '@angular/core';

import { existingControlContainer } from '../providers/control-container.factory';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-responsibility-types',
  templateUrl: './responsibility-types.component.html',
  viewProviders: [existingControlContainer],
})
export class ResponsibilityTypesComponent {
  @Input() controlName: string;
}
