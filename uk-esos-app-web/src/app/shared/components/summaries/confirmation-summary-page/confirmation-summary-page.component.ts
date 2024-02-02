import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { PipesModule } from '@shared/pipes/pipes.module';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { Confirmations } from 'esos-api';

@Component({
  selector: 'esos-confirmation-summary-page',
  standalone: true,
  imports: [
    GovukDatePipe,
    LinkDirective,
    PipesModule,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NgIf,
  ],
  templateUrl: './confirmation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationSummaryPageComponent {
  @Input() confirmation: Confirmations;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
}
