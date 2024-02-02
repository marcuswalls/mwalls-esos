import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  ReportingObligationStepUrl,
} from '@tasks/notification/subtasks/reporting-obligation/reporting-obligation.helper';

import {
  ButtonDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ReportingObligation } from 'esos-api';

@Component({
  selector: 'esos-reporting-obligation-summary-page',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    NgSwitch,
    NgTemplateOutlet,
    NgIf,
    NgSwitchCase,
    NgForOf,
    ButtonDirective,
  ],
  styles: [
    `
      .data-list {
        padding-inline-start: 20px;
      }
    `,
  ],
  templateUrl: './reporting-obligation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSummaryPageComponent {
  @Input() data: ReportingObligation;
  @Input() isEditable = false;

  protected stepUrls = ReportingObligationStepUrl;
  protected roContentMap = REPORTING_OBLIGATION_CONTENT_MAP;
  protected contentMap = {
    qualificationType: {
      QUALIFY: 'Yes, the organisation qualifies for ESOS and will submit a notification',
      NOT_QUALIFY: 'No, the organisation does not qualify for ESOS and will not submit a notification',
    },
    qualificationReasons: {
      TURNOVER_MORE_THAN_44M: 'The turnover is over £44m and annual balance sheet total in excess of £38M',
      STAFF_MEMBERS_MORE_THAN_250: 'The organisation has over 250 members of staff',
    },
    energyResponsibility: {
      RESPONSIBLE: 'Yes, the organisation is responsible for energy',
      NOT_RESPONSIBLE: 'No, the organisation has no energy responsibility and the total energy consumption is zero',
      RESPONSIBLE_BUT_LESS_THAN_40000_KWH:
        'Yes, the organisation is responsible for energy, but used less than 40,000 kWh of energy in the reference period',
    },
  };
}
