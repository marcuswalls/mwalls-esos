import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

import {
  EnergyConsumptionDetailsSummaryTemplateComponent,
  EnergySavingsCategoriesSummaryTemplateComponent,
  EnergySavingsDetailsSummaryTemplateComponent,
  EnergySavingsRecommendationsSummaryTemplateComponent,
  EnergySavingsTotalEstimationSummaryTemplateComponent,
} from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { EnergySavingsAchieved } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-achieved-summary-page',
  templateUrl: './energy-savings-achieved-summary-page.component.html',
  standalone: true,
  imports: [
    PageHeadingComponent,
    NgIf,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    EnergySavingsCategoriesSummaryTemplateComponent,
    EnergySavingsDetailsSummaryTemplateComponent,
    EnergySavingsRecommendationsSummaryTemplateComponent,
    EnergySavingsTotalEstimationSummaryTemplateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsAchievedSummaryPageComponent {
  @Input() data: EnergySavingsAchieved;
  @Input() isEditable = false;
  @Input() wizardStep: { [s: string]: string };
  @Input() queryParams: Params = {};
}
