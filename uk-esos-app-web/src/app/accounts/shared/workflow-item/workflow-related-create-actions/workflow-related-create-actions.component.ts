import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { combineLatest, Observable, switchMap, takeUntil } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { SharedModule } from '@shared/shared.module';

import {
  RequestCreateActionProcessDTO,
  RequestCreateActionProcessResponseDTO,
  RequestItemsService,
  RequestsService,
} from 'esos-api';

import { createRequestCreateActionProcessDTO, requestCreateActionTypeLabelMap } from './workflowCreateAction';

@Component({
  selector: 'esos-workflow-related-create-actions',
  template: `
    <aside class="app-related-items" role="complementary">
      <h2 class="govuk-heading-m" id="subsection-title">Related actions</h2>
      <nav role="navigation" aria-labelledby="subsection-title">
        <ul class="govuk-list govuk-!-font-size-16">
          <li *ngFor="let requestCreateActionType of requestCreateActionsTypes$ | async">
            <a govukLink routerLink="." (click)="onClick(requestCreateActionType)">{{
              requestCreateActionType | i18nSelect: requestCreateActionTypeLabelMap
            }}</a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styleUrls: ['./workflow-related-create-actions.component.scss'],
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class WorkflowRelatedCreateActionsComponent {
  @Input() accountId$: Observable<number>;
  @Input() requestId$: Observable<string>;
  @Input() requestCreateActionsTypes$: Observable<RequestCreateActionProcessDTO['requestCreateActionType'][]>;

  requestCreateActionTypeLabelMap = requestCreateActionTypeLabelMap;

  constructor(
    private readonly requestsService: RequestsService,
    private readonly requestItemsService: RequestItemsService,
    private readonly destroy$: DestroySubject,
    private readonly router: Router,
  ) {}

  onClick(requestCreateActionType: RequestCreateActionProcessDTO['requestCreateActionType']): void {
    combineLatest([this.requestId$, this.accountId$])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([requestId, accountId]) =>
          this.requestsService.processRequestCreateAction(
            createRequestCreateActionProcessDTO(requestCreateActionType, requestId),
            accountId,
          ),
        ),
        switchMap((response: RequestCreateActionProcessResponseDTO) =>
          this.requestItemsService.getItemsByRequest(response.requestId),
        ),
      )
      .subscribe(({ items }) => {
        const itemLinkPipe = new ItemLinkPipe();
        const link = items?.length == 1 ? itemLinkPipe.transform(items[0]) : ['/dashboard'];
        this.router.navigate(link);
      });
  }
}
