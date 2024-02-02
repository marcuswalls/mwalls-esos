import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

import {
  EnergyConsumptionDetailsSummaryTemplateComponent,
  EnergySavingCategoriesDetailsSummaryTemplateComponent,
} from '@shared/components/summaries';

import { EnergySavingsOpportunities } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-opportunities-summary-page',
  standalone: true,
  imports: [
    EnergyConsumptionDetailsSummaryTemplateComponent,
    EnergySavingCategoriesDetailsSummaryTemplateComponent,
    NgIf,
  ],
  templateUrl: './energy-savings-opportunities-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsOpportunitiesSummaryPageComponent {
  @Input() data: EnergySavingsOpportunities;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}
