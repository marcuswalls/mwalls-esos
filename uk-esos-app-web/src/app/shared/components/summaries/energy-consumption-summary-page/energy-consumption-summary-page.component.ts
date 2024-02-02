import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EnergyConsumptionDetailsSummaryTemplateComponent } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { EnergyConsumptionDetails } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-summary-page',
  standalone: true,
  imports: [
    GovukComponentsModule,
    NgIf,
    RouterLink,
    NgForOf,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    BooleanToTextPipe,
  ],
  templateUrl: './energy-consumption-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionSummaryPageComponent {
  @Input() data: EnergyConsumptionDetails;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}
