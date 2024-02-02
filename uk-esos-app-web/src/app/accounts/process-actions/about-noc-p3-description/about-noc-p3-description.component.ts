import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from 'govuk-components';

@Component({
  selector: 'esos-about-noc-p3-description',
  standalone: true,
  imports: [DetailsComponent],
  templateUrl: './about-noc-p3-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutNocP3DescriptionComponent {}
