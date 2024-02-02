import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { EnergySavingsCategories } from 'esos-api';

@Component({
  selector: 'esos-energy-savings-categories-summary-template',
  templateUrl: './energy-savings-categories-summary-template.component.html',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, RouterLink, BooleanToTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingsCategoriesSummaryTemplateComponent {
  @Input() energySavingCategoriesExist: boolean;
  @Input() energySavingsCategories: EnergySavingsCategories;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() changeLinkExist = '';
  @Input() changeLink = '';
}
