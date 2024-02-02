import { ComplianceRoute } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';

export const isWizardCompleted = (complianceRoute: ComplianceRoute, category: ReportingObligationCategory) => {
  const hasEnergyConsumptionProfilingUsedData = !!complianceRoute?.energyConsumptionProfilingUsed;

  const isWizardCompletedRouteAOrRouteCOrRouteE =
    complianceRoute?.areDataEstimated !== undefined &&
    (complianceRoute?.areDataEstimated
      ? complianceRoute?.areEstimationMethodsRecordedInEvidencePack !== undefined
      : !!complianceRoute?.twelveMonthsVerifiableDataUsed) &&
    hasEnergyConsumptionProfilingUsedData &&
    (complianceRoute?.energyConsumptionProfilingUsed == 'YES'
      ? complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded !== undefined
      : !!complianceRoute?.energyAudits) &&
    complianceRoute?.partsProhibitedFromDisclosingExist !== undefined &&
    (complianceRoute?.partsProhibitedFromDisclosingExist
      ? !!complianceRoute?.partsProhibitedFromDisclosing && !!complianceRoute?.partsProhibitedFromDisclosingReason
      : true);

  const isWizardCompletedRouteBOrRouteF =
    ['ISO_50001_COVERING_ENERGY_USAGE', 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100'].includes(category) &&
    complianceRoute?.areDataEstimated !== undefined &&
    (complianceRoute?.areDataEstimated
      ? complianceRoute?.areEstimationMethodsRecordedInEvidencePack !== undefined
      : true) &&
    complianceRoute?.partsProhibitedFromDisclosingExist !== undefined &&
    (complianceRoute?.partsProhibitedFromDisclosingExist
      ? !!complianceRoute?.partsProhibitedFromDisclosing && !!complianceRoute?.partsProhibitedFromDisclosingReason
      : true) &&
    !hasEnergyConsumptionProfilingUsedData;

  return isWizardCompletedRouteAOrRouteCOrRouteE || isWizardCompletedRouteBOrRouteF;
};
