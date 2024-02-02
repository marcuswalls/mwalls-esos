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

import { Assets } from 'esos-api';

@Component({
  selector: 'esos-assets-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NgIf,
  ],
  templateUrl: './assets-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsSummaryTemplateComponent {
  @Input() assets: Assets;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
