import { Routes } from '@angular/router';

import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';

import { SendToRestrictedComponent } from './send-to-restricted/send-to-restricted.component';
import { SendToRestrictedSuccessComponent } from './send-to-restricted-success/send-to-restricted-success.component';

export const SEND_TO_RESTRICTED_ROUTES: Routes = [
  {
    path: '',
    providers: [NotificationApiService, NotificationStateService],
    children: [
      {
        path: '',
        component: SendToRestrictedComponent,
      },
      {
        path: 'success',
        component: SendToRestrictedSuccessComponent,
      },
    ],
  },
];
