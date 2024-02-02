import { NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Injector, Signal, Type } from '@angular/core';

import { TaskListComponent } from '@common/shared/components/task-list';
import { TaskSection } from '@common/shared/model';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';

import { RequestActionDTO } from 'esos-api';

import { requestActionQuery, RequestActionStore } from '../../+state';
import { REQUEST_ACTION_PAGE_CONTENT } from '../../request-action.providers';
import { RequestActionPageContentFactoryMap } from '../../request-action.types';

type ViewModel = {
  requestAction: RequestActionDTO;
  header: string;
  sections: TaskSection[];
  component: Type<unknown>;
};

@Component({
  selector: 'esos-request-action-page',
  standalone: true,
  imports: [NgIf, NgComponentOutlet, NgForOf, PageHeadingComponent, TaskListComponent, GovukDatePipe],
  templateUrl: './request-action-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestActionPageComponent {
  vm: Signal<ViewModel> = computed(() => {
    const requestAction = this.store.select(requestActionQuery.selectAction)();
    if (!requestAction) {
      return null;
    }

    const { header, sections, component } = this.contentFactoryMap[requestAction.type](this.injector);

    return {
      requestAction,
      header,
      sections,
      component,
    };
  });

  constructor(
    @Inject(REQUEST_ACTION_PAGE_CONTENT) private readonly contentFactoryMap: RequestActionPageContentFactoryMap,
    private readonly store: RequestActionStore,
    private readonly injector: Injector,
  ) {}
}
