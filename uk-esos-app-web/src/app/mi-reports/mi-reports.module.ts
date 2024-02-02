import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';

import { AccountsRegulatorsSiteContactsComponent } from './accounts-regulators-site-contacts/accounts-regulators-site-contacts.component';
import { AccountsUsersContactsComponent } from './accounts-users-contacts/accounts-users-contacts.component';
import { CompletedWorkComponent } from './completed-work/completed-work.component';
import { CustomReportComponent } from './custom/custom.component';
import { MiReportsComponent } from './mi-reports.component';
import { MiReportsRoutingModule } from './mi-reports-routing.module';
import { AuthorityStatusPipe } from './pipes/authority-status.pipe';
import { VerificationBodyStatusPipe } from './pipes/verification-body-status.pipe';

@NgModule({
  declarations: [
    AccountsRegulatorsSiteContactsComponent,
    AccountsUsersContactsComponent,
    AuthorityStatusPipe,
    CompletedWorkComponent,
    CustomReportComponent,
    MiReportsComponent,
    VerificationBodyStatusPipe,
  ],
  imports: [MiReportsRoutingModule, PageHeadingComponent, PendingButtonDirective, RouterModule, SharedModule],
})
export class MiReportsModule {}
