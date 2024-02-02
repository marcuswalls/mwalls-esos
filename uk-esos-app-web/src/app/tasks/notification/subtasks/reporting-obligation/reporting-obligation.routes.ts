import { Routes } from '@angular/router';

import { ComplianceRouteDistributionComponent } from './compliance-route-distribution';
import { EnergyResponsibilityComponent } from './energy-responsibility';
import { NoQualificationReasonComponent } from './no-qualification-reason';
import { QualificationReasonsComponent } from './qualification-reasons';
import { QualificationTypeComponent } from './qualification-type';
import {
  canActivateComplianceDistributionStep,
  canActivateEnergyResponsibilityStep,
  canActivateNoQualificationReasonStep,
  canActivateQualificationReasonsStep,
  canActivateReportingObligationStep,
  canActivateReportingObligationSummary,
} from './reporting-obligation.guards';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  ReportingObligationStep,
  ReportingObligationStepUrl,
} from './reporting-obligation.helper';
import { ReportingObligationSummaryComponent } from './reporting-obligation-summary';

export const REPORTING_OBLIGATION_ROUTES: Routes = [
  {
    path: '',
    title: REPORTING_OBLIGATION_CONTENT_MAP.title,
    data: { breadcrumb: true },
    canActivate: [canActivateReportingObligationSummary],
    component: ReportingObligationSummaryComponent,
  },
  {
    path: ReportingObligationStepUrl.QUALIFICATION_TYPE,
    title: REPORTING_OBLIGATION_CONTENT_MAP[ReportingObligationStep.QUALIFICATION_TYPE].title,
    canActivate: [canActivateReportingObligationStep],
    component: QualificationTypeComponent,
  },
  {
    path: ReportingObligationStepUrl.NO_QUALIFICATION_REASON,
    title: REPORTING_OBLIGATION_CONTENT_MAP[ReportingObligationStep.NO_QUALIFICATION_REASON].title,
    data: { backlink: `../${ReportingObligationStepUrl.QUALIFICATION_TYPE}` },
    canActivate: [canActivateReportingObligationStep, canActivateNoQualificationReasonStep],
    component: NoQualificationReasonComponent,
  },
  {
    path: ReportingObligationStepUrl.QUALIFICATION_REASONS,
    title: REPORTING_OBLIGATION_CONTENT_MAP[ReportingObligationStep.QUALIFICATION_REASONS].title,
    data: { backlink: `../${ReportingObligationStepUrl.QUALIFICATION_TYPE}` },
    canActivate: [canActivateReportingObligationStep, canActivateQualificationReasonsStep],
    component: QualificationReasonsComponent,
  },
  {
    path: ReportingObligationStepUrl.ENERGY_RESPONSIBILITY,
    title: REPORTING_OBLIGATION_CONTENT_MAP[ReportingObligationStep.ENERGY_RESPONSIBILITY].title,
    data: { backlink: `../${ReportingObligationStepUrl.QUALIFICATION_REASONS}` },
    canActivate: [canActivateReportingObligationStep, canActivateEnergyResponsibilityStep],
    component: EnergyResponsibilityComponent,
  },
  {
    path: ReportingObligationStepUrl.COMPLIANCE_ROUTE_DISTRIBUTION,
    title: REPORTING_OBLIGATION_CONTENT_MAP[ReportingObligationStep.COMPLIANCE_ROUTE_DISTRIBUTION].title,
    data: { backlink: `../${ReportingObligationStepUrl.ENERGY_RESPONSIBILITY}` },
    canActivate: [canActivateReportingObligationStep, canActivateComplianceDistributionStep],
    component: ComplianceRouteDistributionComponent,
  },
];
