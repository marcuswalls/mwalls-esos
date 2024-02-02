import { Injectable } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { NocP3, ReportingObligation } from 'esos-api';

import { ReportingObligationCategory } from '../../../requests/common/reporting-obligation-category.types';
import { NotificationTaskPayload } from '../notification.types';

@Injectable()
export class NotificationStateService extends TaskStateService<NotificationTaskPayload> {
  private stagedPayload: NotificationTaskPayload;

  get payload(): NotificationTaskPayload {
    const payload = this.store.state.requestTaskItem.requestTask.payload as NotificationTaskPayload;

    return {
      ...payload,
      noc: payload.noc ?? {
        reportingObligation: {} as ReportingObligation,
      },
    };
  }

  get stagedChanges(): NotificationTaskPayload {
    return this.stagedPayload;
  }

  stageForSave(payload: NotificationTaskPayload): void {
    this.stagedPayload = { ...payload };
  }

  setPayload(payload: NotificationTaskPayload): void {
    this.store.setPayload(payload);
  }

  setNocAttachments(attachments: { [key: string]: string }) {
    this.store.setPayload(
      produce(this.payload, (state) => {
        state.nocAttachments = attachments;
      }),
    );
  }

  setNocSectionsCompleted(nocSectionsCompleted: Record<keyof NocP3, TaskItemStatus>) {
    this.store.setPayload(
      produce(this.payload, (payload) => {
        payload.nocSectionsCompleted = nocSectionsCompleted;
      }),
    );
  }

  setLastReportingObligationCategory(lastReportingObligationCategory: ReportingObligationCategory) {
    this.store.setMetadata({
      ...this.store.state.metadata,
      lastReportingObligationCategory,
    });
  }
}
