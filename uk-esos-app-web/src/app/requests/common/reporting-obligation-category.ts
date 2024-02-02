import { ComplianceRouteDistribution, ReportingObligation, ReportingObligationDetails } from 'esos-api';

import {
  EnergyResponsibleReportingObligationCategory,
  QualifiedReportingObligationCategory,
  ReportingObligationCategory,
} from './reporting-obligation-category.types';

export function determineReportingObligationCategory(
  reportingObligation: ReportingObligation,
): ReportingObligationCategory {
  if (reportingObligation?.qualificationType === 'NOT_QUALIFY') {
    return 'NOT_QUALIFY';
  } else {
    return reportingObligation?.reportingObligationDetails
      ? determineQualifiedReportingObligationCategory(reportingObligation.reportingObligationDetails)
      : null;
  }
}

function determineQualifiedReportingObligationCategory(
  reportingObligationDetails: ReportingObligationDetails,
): QualifiedReportingObligationCategory {
  const energyResponsibilityType = reportingObligationDetails.energyResponsibilityType;
  const complianceRouteDistribution = reportingObligationDetails.complianceRouteDistribution;

  if (!energyResponsibilityType) {
    return null;
  }

  switch (energyResponsibilityType) {
    case 'NOT_RESPONSIBLE':
      return 'ZERO_ENERGY';
    case 'RESPONSIBLE_BUT_LESS_THAN_40000_KWH':
      return 'LESS_THAN_40000_KWH_PER_YEAR';
    case 'RESPONSIBLE':
      return complianceRouteDistribution
        ? determineEnergyResponsibleReportingObligationCategory(complianceRouteDistribution)
        : null;
  }
}

function determineEnergyResponsibleReportingObligationCategory(
  complianceRouteDistribution: ComplianceRouteDistribution,
): EnergyResponsibleReportingObligationCategory {
  const iso50001Pct = complianceRouteDistribution.iso50001Pct;
  const displayEnergyCertificatePct = complianceRouteDistribution.displayEnergyCertificatePct;
  const greenDealAssessmentPct = complianceRouteDistribution.greenDealAssessmentPct;
  const energyAuditsPct = complianceRouteDistribution.energyAuditsPct;

  if ([iso50001Pct, displayEnergyCertificatePct, greenDealAssessmentPct].some((v) => v > 0)) {
    if (iso50001Pct === 100) {
      return 'ISO_50001_COVERING_ENERGY_USAGE';
    }
    if (energyAuditsPct > 0) {
      return 'PARTIAL_ENERGY_ASSESSMENTS';
    } else {
      return 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100';
    }
  } else {
    return 'ESOS_ENERGY_ASSESSMENTS_95_TO_100';
  }
}
