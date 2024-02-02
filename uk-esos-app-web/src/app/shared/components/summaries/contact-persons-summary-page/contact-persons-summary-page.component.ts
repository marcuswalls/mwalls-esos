import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { UserInputSummaryTemplateComponent } from '@shared/components/user-input-summary/user-input-summary.component';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { ContactPersons } from 'esos-api';

@Component({
  selector: 'esos-contact-persons-summary-page',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink, UserInputSummaryTemplateComponent, BooleanToTextPipe],
  templateUrl: './contact-persons-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsSummaryPageComponent {
  @Input() data: ContactPersons;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}
