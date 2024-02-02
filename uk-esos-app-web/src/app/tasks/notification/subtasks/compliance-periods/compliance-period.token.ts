import { InjectionToken } from '@angular/core';

export enum CompliancePeriodSubtask {
  FIRST = 'firstCompliancePeriod',
  SECOND = 'secondCompliancePeriod',
}
export type CompliancePeriod = CompliancePeriodSubtask.FIRST | CompliancePeriodSubtask.SECOND;
export const COMPLIANCE_PERIOD_SUB_TASK = new InjectionToken<CompliancePeriod>('compliance period');
