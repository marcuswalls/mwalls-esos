import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { CertificateDetails } from 'esos-api';

@Component({
  selector: 'esos-certificate-details-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NgIf,
    GovukDatePipe,
  ],
  templateUrl: './certificate-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateDetailsSummaryTemplateComponent {
  @Input() certificateDetails: CertificateDetails;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
