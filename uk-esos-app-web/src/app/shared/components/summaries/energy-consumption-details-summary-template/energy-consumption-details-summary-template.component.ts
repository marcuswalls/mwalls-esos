import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

import { EnergyConsumption, SignificantEnergyConsumption } from 'esos-api';

@Component({
  selector: 'esos-energy-consumption-details-summary-template',
  templateUrl: './energy-consumption-details-summary-template.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyConsumptionDetailsSummaryTemplateComponent {
  @Input() energyConsumption: EnergyConsumption & {
    significantEnergyConsumptionPct?: SignificantEnergyConsumption['significantEnergyConsumptionPct'];
  };
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
