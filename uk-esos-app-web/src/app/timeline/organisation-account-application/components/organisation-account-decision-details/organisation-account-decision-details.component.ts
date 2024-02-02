import { LowerCasePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { AccountOpeningDecisionPayload } from 'esos-api';

@Component({
  selector: 'esos-organisation-account-decision-details',
  standalone: true,
  imports: [
    SummaryHeaderComponent,
    LinkDirective,
    NgIf,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LowerCasePipe,
  ],
  templateUrl: './organisation-account-decision-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationAccountDecisionDetailsComponent {
  private _details: AccountOpeningDecisionPayload;
  @Input() set details(val: AccountOpeningDecisionPayload) {
    this._details = val;
    this.decisionAction = val.decision === 'REJECTED' ? 'Rejection' : 'Approval';
  }
  get details(): AccountOpeningDecisionPayload {
    return this._details;
  }

  protected decisionAction: 'Rejection' | 'Approval';
}
