import { NgModule } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';

import { SharedUserModule } from '../shared-user/shared-user.module';
import { DeleteComponent } from './delete/delete.component';
import { DetailsComponent } from './details/details.component';
import { SignatureFileDownloadComponent } from './file-download/signature-file-download.component';
import { RegulatorsComponent } from './regulators.component';
import { RegulatorRoutingModule } from './regulators-routing.module';

@NgModule({
  declarations: [DeleteComponent, DetailsComponent, RegulatorsComponent, SignatureFileDownloadComponent],
  imports: [PageHeadingComponent, PendingButtonDirective, RegulatorRoutingModule, SharedModule, SharedUserModule],
})
export class RegulatorsModule {}
