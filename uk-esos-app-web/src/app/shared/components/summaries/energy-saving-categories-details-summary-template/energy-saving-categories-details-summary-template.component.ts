import { NgIf } from '@angular/common';
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

import { EnergySavingsCategories } from 'esos-api';

@Component({
  selector: 'esos-energy-saving-categories-details-summary-template',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
  ],
  templateUrl: './energy-saving-categories-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergySavingCategoriesDetailsSummaryTemplateComponent {
  @Input() energySavingsCategories: EnergySavingsCategories;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
