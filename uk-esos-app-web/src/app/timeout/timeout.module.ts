import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';

import { TimedOutComponent } from './timed-out/timed-out.component';
import { TimeoutBannerComponent } from './timeout-banner/timeout-banner.component';

@NgModule({
  declarations: [TimedOutComponent, TimeoutBannerComponent],
  imports: [CommonModule, PageHeadingComponent, SharedModule],
  exports: [TimeoutBannerComponent],
})
export class TimeoutModule {}
