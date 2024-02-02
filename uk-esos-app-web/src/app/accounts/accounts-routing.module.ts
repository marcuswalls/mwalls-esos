import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { NoteFileDownloadComponent } from '@shared/components/note-file-download/note-file-download.component';
import { FileDownloadComponent } from '@shared/file-download/file-download.component';

import {
  AccountComponent,
  AccountGuard,
  AccountNoteComponent,
  AccountsPageComponent,
  AccountsStore,
  AccountStatusGuard,
  AddComponent as OperatorAddComponent,
  AppointComponent,
  AppointGuard,
  DeleteAccountNoteComponent,
  DeleteComponent as OperatorDeleteComponent,
  DeleteGuard as OperatorDeleteGuard,
  DetailsComponent as OperatorDetailsComponent,
  DetailsGuard as OperatorDetailsGuard,
  ProcessActionsComponent,
  ReplaceGuard,
  ReportsComponent,
} from '.';

const workflowDetailsRoutes: Routes = [
  {
    path: ':request-id',
    data: { pageTitle: 'Workflow item', breadcrumb: ({ requestId }) => requestId },
    resolve: { requestId: (route) => route.paramMap.get('request-id') },
    children: [
      {
        path: '',
        loadChildren: () => import('./shared/workflow-item/workflow-item.module').then((m) => m.WorkflowItemModule),
      },
      {
        path: 'payment',
        loadChildren: () => import('../payment/payment.module').then((m) => m.PaymentModule),
      },
    ],
  },
];

const routes: Routes = [
  {
    path: '',
    providers: [AccountsStore],
    component: AccountsPageComponent,
  },
  {
    path: 'new',
    loadChildren: () =>
      import('./organisation-account-application/organisation-account-application.routes').then((r) => r.ROUTES),
  },
  {
    path: ':accountId',
    canActivate: [AccountGuard],
    canDeactivate: [AccountGuard],
    resolve: { data: AccountGuard },
    runGuardsAndResolvers: 'always',
    data: { breadcrumb: { resolveText: ({ data }) => data.name } },
    children: [
      {
        path: '',
        data: { pageTitle: 'Account' },
        component: AccountComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'permit/:permitId/:fileType/:uuid',
        component: FileDownloadComponent,
      },
      {
        path: 'verification-body',
        children: [
          {
            path: 'appoint',
            data: {
              pageTitle: 'Users, contacts and verifiers - Appoint a verifier',
              breadcrumb: true,
            },
            component: AppointComponent,
            canActivate: [AppointGuard],
            canDeactivate: [PendingRequestGuard],
          },
          {
            path: 'replace',
            data: {
              pageTitle: 'Users, contacts and verifiers - Replace a verifier',
              breadcrumb: true,
            },
            component: AppointComponent,
            canActivate: [ReplaceGuard],
            canDeactivate: [PendingRequestGuard],
            resolve: { verificationBody: ReplaceGuard },
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: ':userId',
            children: [
              {
                path: '',
                pathMatch: 'full',
                data: {
                  pageTitle: 'User details',
                  breadcrumb: ({ user }) => `${user.firstName} ${user.lastName}`,
                },
                component: OperatorDetailsComponent,
                canActivate: [OperatorDetailsGuard],
                canDeactivate: [PendingRequestGuard],
                resolve: { user: OperatorDetailsGuard },
              },
              {
                path: 'delete',
                data: {
                  pageTitle: 'Confirm that this user account will be deleted',
                  breadcrumb: ({ user }) => `Delete ${user.firstName} ${user.lastName}`,
                },
                component: OperatorDeleteComponent,
                canActivate: [OperatorDeleteGuard],
                canDeactivate: [PendingRequestGuard],
                resolve: { user: OperatorDeleteGuard },
              },
              {
                path: '2fa',
                loadChildren: () => import('../two-fa/two-fa.module').then((m) => m.TwoFaModule),
              },
            ],
          },
          {
            path: 'add/:userType',
            data: {
              pageTitle: 'Users, contacts and verifiers - Add user',
              breadcrumb: true,
            },
            component: OperatorAddComponent,
            canActivate: [AccountStatusGuard],
            canDeactivate: [PendingRequestGuard],
          },
        ],
      },
      //  add edit routes below
      // {
      //   path: 'edit',
      //   children: [],
      // },
      {
        path: 'process-actions',
        data: { pageTitle: 'Account process actions', breadcrumb: true, backlink: '../' },
        component: ProcessActionsComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'workflows',
        children: workflowDetailsRoutes,
      },
      {
        path: 'phases',
        children: workflowDetailsRoutes,
      },
      {
        path: 'reports',
        data: { pageTitle: 'Reports', breadcrumb: true },
        component: ReportsComponent,
      },
      {
        path: 'notes',
        children: [
          {
            path: 'add',
            data: { pageTitle: 'Add a note', breadcrumb: true },
            component: AccountNoteComponent,
            canDeactivate: [PendingRequestGuard],
          },
          {
            path: ':noteId/edit',
            data: { pageTitle: 'Edit a note', breadcrumb: true },
            component: AccountNoteComponent,
            canDeactivate: [PendingRequestGuard],
          },
          {
            path: ':noteId/delete',
            data: { pageTitle: 'Delete a note', breadcrumb: true },
            component: DeleteAccountNoteComponent,
            canDeactivate: [PendingRequestGuard],
          },
        ],
      },
      {
        path: 'file-download/:uuid',
        component: NoteFileDownloadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
