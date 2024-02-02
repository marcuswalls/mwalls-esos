import { ActivatedRoute } from '@angular/router';

import {
  NotificationOfComplianceP3ApplicationEditRequestTaskPayload,
  NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
} from 'esos-api';

export type NotificationTaskPayload =
  | NotificationOfComplianceP3ApplicationEditRequestTaskPayload
  | NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

export interface SendToRestrictedPayload {
  participant: {
    id: string;
    fullName: string;
  };
  route: ActivatedRoute;
}
