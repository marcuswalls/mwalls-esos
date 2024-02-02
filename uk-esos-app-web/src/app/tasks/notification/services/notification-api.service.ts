import { computed, Injectable, Signal } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiService } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import {
  NotificationOfComplianceP3ApplicationEditRequestTaskPayload,
  RequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from 'esos-api';

import { NotificationTaskPayload } from '../notification.types';

type SaveActionTypes = {
  actionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  actionPayloadType: RequestTaskActionPayload['payloadType'];
};

@Injectable()
export class NotificationApiService extends TaskApiService<NotificationTaskPayload> {
  constructor(
    private readonly pendingRequestService: PendingRequestService,
    private readonly businessErrorService: BusinessErrorService,
  ) {
    super();
  }

  save(payload: NotificationTaskPayload): Observable<void> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  returnToSubmit() {
    return this.service.processRequestTaskAction(this.createActionMap().returnToSubmit).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  sendToRestricted(result: RequestTaskActionProcessDTO & NotificationOfComplianceP3ApplicationEditRequestTaskPayload) {
    return this.service.processRequestTaskAction(result).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createActionMap().submit).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
        return {
          actionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT',
          actionPayloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT_PAYLOAD',
        };
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
          actionPayloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        };
    }
  }

  private createSaveAction(payload: NotificationTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { noc, nocSectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        noc,
        nocSectionsCompleted,
      },
    };
  }

  private createActionMap: Signal<Record<'returnToSubmit' | 'submit', RequestTaskActionProcessDTO>> = computed(() => ({
    returnToSubmit: {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      } as RequestTaskActionPayload,
    },
    submit: {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      } as RequestTaskActionPayload,
    },
  }));
}
