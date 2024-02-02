import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from 'govuk-components';

@Component({
  selector: 'esos-help-me',
  standalone: true,
  imports: [DetailsComponent],
  templateUrl: './help-me.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpMeComponent {}
