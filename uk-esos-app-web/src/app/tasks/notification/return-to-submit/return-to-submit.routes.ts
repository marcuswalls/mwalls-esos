import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';

export const RETURN_FOR_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Return notification' },
        loadComponent: () => import('./action/action.component').then((c) => c.ReturnToSubmitActionComponent),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./confirmation/confirmation.component').then((c) => c.ReturnToSubmitConfirmationComponent),
      },
    ],
  },
];
