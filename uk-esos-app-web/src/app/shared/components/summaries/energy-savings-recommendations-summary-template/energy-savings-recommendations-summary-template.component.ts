import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsRecommendations } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-recommendations-summary-template',
  templateUrl: './energy-savings-recommendations-summary-template.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink, BooleanToTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsRecommendationsSummaryTemplateComponent {
  @Input() energySavingsRecommendationsExist: boolean;
  @Input() energySavingsRecommendations: EnergySavingsRecommendations;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() changeLinkExist = '';
  @Input() changeLink = '';
}
