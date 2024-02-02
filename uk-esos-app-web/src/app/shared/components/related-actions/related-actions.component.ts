import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

import { RequestTaskActionProcessDTO } from 'esos-api';

import { requestTaskAllowedActions } from './request-task-allowed-actions.map';

@Component({
  selector: 'esos-related-actions',
  standalone: true,
  template: `
    <aside class="app-related-items" role="complementary">
      <h2 class="govuk-heading-m" id="subsection-title">Related actions</h2>
      <nav role="navigation" aria-labelledby="subsection-title">
        <ul class="govuk-list govuk-!-font-size-16">
          <li *ngFor="let action of allActions">
            <a [routerLink]="action.link" govukLink [relativeTo]="route">{{ action.text }}</a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styleUrls: ['./related-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, RouterLink, GovukComponentsModule],
})
export class RelatedActionsComponent implements OnChanges {
  @Input() isAssignable: boolean;
  @Input() taskId: number;
  @Input() allowedActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>;
  allActions: { text: string; link: any[] }[] = [];

  constructor(protected route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('taskId' in changes || 'allowedActions' in changes || 'isAssignable' in changes) {
      this.allActions = requestTaskAllowedActions(this.allowedActions, this.taskId);
      if (this.isAssignable) {
        this.allActions.unshift({ text: 'Reassign task', link: ['change-assignee'] });
      }
    }
  }
}
