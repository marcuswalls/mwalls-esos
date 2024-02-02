import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

@Component({
  selector: 'esos-energy-savings-total-estimation-summary-template',
  templateUrl: './energy-savings-total-estimation-summary-template.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsTotalEstimationSummaryTemplateComponent {
  @Input() totalEnergySavingsEstimation: number;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() changeLink = '';
}
