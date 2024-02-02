import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

@Component({
  selector: 'esos-total-energy-consumption-reduction-summary-template',
  standalone: true,
  imports: [
    CommonModule,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    LinkDirective,
  ],
  templateUrl: './total-energy-consumption-reduction-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalEnergyConsumptionReductionSummaryTemplateComponent {
  @Input() totalEnergyConsumptionReduction: number;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
