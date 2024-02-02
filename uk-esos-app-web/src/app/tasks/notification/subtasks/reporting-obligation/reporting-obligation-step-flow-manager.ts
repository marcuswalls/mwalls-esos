import { StepFlowManager } from '@common/forms/step-flow';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import {
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
  ReportingObligationStepUrl,
} from '@tasks/notification/subtasks/reporting-obligation/reporting-obligation.helper';

import { ReportingObligation } from 'esos-api';

export class ReportingObligationStepFlowManager extends StepFlowManager {
  subtask = REPORTING_OBLIGATION_SUBTASK;

  resolveNextStepRoute(currentStep: string): string {
    switch (currentStep) {
      case ReportingObligationStep.QUALIFICATION_TYPE:
        return this.getNextRouteForQualificationType();
      case ReportingObligationStep.NO_QUALIFICATION_REASON:
        return '../';
      case ReportingObligationStep.QUALIFICATION_REASONS:
        return `../${ReportingObligationStepUrl.ENERGY_RESPONSIBILITY}`;
      case ReportingObligationStep.ENERGY_RESPONSIBILITY:
        return this.getNextRouteForEnergyResponsibility();
      case ReportingObligationStep.COMPLIANCE_ROUTE_DISTRIBUTION:
        return `../`;
      case ReportingObligationStep.SUMMARY:
        return `../..`;
    }
  }

  private getNextRouteForQualificationType(): string {
    const qt = this.reportingObligation.qualificationType;
    switch (qt) {
      case 'QUALIFY':
        return `../${ReportingObligationStepUrl.QUALIFICATION_REASONS}`;
      case 'NOT_QUALIFY':
        return `../${ReportingObligationStepUrl.NO_QUALIFICATION_REASON}`;
    }
  }

  private getNextRouteForEnergyResponsibility(): string {
    const er = this.reportingObligation.reportingObligationDetails.energyResponsibilityType;
    return er === 'NOT_RESPONSIBLE' ? `../` : `../${ReportingObligationStepUrl.COMPLIANCE_ROUTE_DISTRIBUTION}`;
  }

  private get reportingObligation(): ReportingObligation {
    return this.store.select(notificationQuery.selectReportingObligation)();
  }
}
