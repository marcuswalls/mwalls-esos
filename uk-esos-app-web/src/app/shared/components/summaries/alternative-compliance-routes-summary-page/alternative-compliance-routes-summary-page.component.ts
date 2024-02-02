import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

import {
  AssetsSummaryTemplateComponent,
  CertificateDetailsListSummaryTemplateComponent,
  CertificateDetailsSummaryTemplateComponent,
  EnergyConsumptionDetailsSummaryTemplateComponent,
  EnergySavingCategoriesDetailsSummaryTemplateComponent,
  TotalEnergyConsumptionReductionSummaryTemplateComponent,
} from '@shared/components/summaries';
import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';

import { AlternativeComplianceRoutes } from 'esos-api';

@Component({
  selector: 'esos-alternative-compliance-routes-summary-page',
  standalone: true,
  imports: [
    NgIf,
    AssetsSummaryTemplateComponent,
    CertificateDetailsListSummaryTemplateComponent,
    CertificateDetailsSummaryTemplateComponent,
    EnergyConsumptionDetailsSummaryTemplateComponent,
    EnergySavingCategoriesDetailsSummaryTemplateComponent,
    TotalEnergyConsumptionReductionSummaryTemplateComponent,
  ],
  templateUrl: './alternative-compliance-routes-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlternativeComplianceRoutesSummaryPageComponent {
  @Input() data: AlternativeComplianceRoutes;
  @Input() alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes>;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};
}
