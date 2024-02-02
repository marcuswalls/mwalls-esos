import { NgModule } from '@angular/core';

import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { NoteFileDownloadComponent } from '@shared/components/note-file-download/note-file-download.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { SharedModule } from '@shared/shared.module';

import { SharedUserModule } from '../shared-user/shared-user.module';
import {
  AccountComponent,
  AccountDetailsComponent,
  AccountNoteComponent,
  AccountNotesComponent,
  AccountsListComponent,
  AccountsPageComponent,
  AddComponent,
  AppointComponent,
  ConfirmationComponent as VerBodyConfirmationComponent,
  DeleteAccountNoteComponent,
  DeleteComponent,
  DetailsComponent as OperatorDetailsComponent,
  OperatorsComponent,
  ProcessActionsComponent,
  ReportsComponent,
  WorkflowsComponent,
} from '.';
import { AccountsRoutingModule } from './accounts-routing.module';

@NgModule({
  declarations: [
    AccountComponent,
    AccountNoteComponent,
    AccountNotesComponent,
    AccountsListComponent,
    AccountsPageComponent,
    AddComponent,
    AppointComponent,
    DeleteAccountNoteComponent,
    DeleteComponent,
    NoteFileDownloadComponent,
    OperatorDetailsComponent,
    OperatorsComponent,
    VerBodyConfirmationComponent,
    WorkflowsComponent,
  ],
  imports: [
    AccountDetailsComponent,
    AccountsRoutingModule,
    GovukDatePipe,
    PageHeadingComponent,
    PendingButtonDirective,
    ProcessActionsComponent,
    ReportsComponent,
    SharedModule,
    SharedUserModule,
    StatusTagColorPipe,
  ],
  providers: [ItemLinkPipe],
})
export class AccountsModule {}
