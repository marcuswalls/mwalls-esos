import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { SharedModule } from '../shared/shared.module';
import { BusinessErrorComponent } from './business-error/business-error.component';
import { ErrorRoutingModule } from './error-routing.module';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [BusinessErrorComponent, InternalServerErrorComponent, PageNotFoundComponent],
  imports: [CommonModule, ErrorRoutingModule, PageHeadingComponent, SharedModule],
})
export class ErrorModule {}
