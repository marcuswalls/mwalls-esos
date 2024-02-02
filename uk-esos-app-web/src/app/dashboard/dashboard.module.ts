import { NgModule } from '@angular/core';

import { WorkflowItemsService } from '@shared/dashboard';
import { SharedModule } from '@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule],
  providers: [WorkflowItemsService],
})
export class DashboardModule {}
