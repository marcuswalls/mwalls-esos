import { NgModule } from '@angular/core';

import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color/status-tag-color.pipe';
import { RelatedTasksComponent } from '@shared/components/related-tasks/related-tasks.component';
import { TimelineComponent } from '@shared/components/timeline/timeline.component';
import { TimelineItemComponent } from '@shared/components/timeline/timeline-item.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { TimelineItemLinkPipe } from '@shared/pipes/timeline-item-link.pipe';
import { SharedModule } from '@shared/shared.module';

import { SharedUserModule } from '../../../shared-user/shared-user.module';
import { WorkflowItemRoutingModule } from './workflow-item-routing.module';

@NgModule({
  imports: [
    GovukDatePipe,
    PageHeadingComponent,
    PendingButtonDirective,
    RelatedTasksComponent,
    SharedModule,
    SharedUserModule,
    StatusTagColorPipe,
    TimelineComponent,
    TimelineItemComponent,
    TimelineItemLinkPipe,
    WorkflowItemRoutingModule,
  ],
})
export class WorkflowItemModule {}
