import { ComplianceRoute } from 'esos-api';

export interface ComplianceRouteViewModel {
  subtaskName?: string;
  data: ComplianceRoute;
  isEditable: boolean;
  sectionsCompleted?: { [key: string]: string };
  wizardStep?: { [s: string]: string };
}
