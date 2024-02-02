import { PhasesPipe } from '@shared/pipes/phases.pipe';

import { NotificationOfComplianceP3RequestMetadata, RequestTaskDTO } from 'esos-api';

import { ReturnToSubmitTaskButtonsComponent, SubmissionTaskButtonsComponent } from './components';

export const getNotificationHeader = (
  requestTaskType: RequestTaskDTO['type'],
  metadata: NotificationOfComplianceP3RequestMetadata,
): string => {
  const phasePipe = new PhasesPipe();

  switch (requestTaskType) {
    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      return 'Submit notification';

    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
      return `Review ${phasePipe.transform(metadata.phase)} notification`;
  }
};

export const getPreContentComponent = (requestTaskType: RequestTaskDTO['type']) => {
  switch (requestTaskType) {
    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      return SubmissionTaskButtonsComponent;

    case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
      return ReturnToSubmitTaskButtonsComponent;
  }
};
