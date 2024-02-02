import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { OrganisationParticipantDetails } from 'esos-api';

@Component({
  selector: 'esos-participant-user-details',
  templateUrl: './participant-user-details.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryHeaderComponent,
    SummaryListComponent,
    NgIf,
  ],
})
export class ParticipantUserDetailsComponent {
  @Input() organisationParticipantDetails: OrganisationParticipantDetails;
}
