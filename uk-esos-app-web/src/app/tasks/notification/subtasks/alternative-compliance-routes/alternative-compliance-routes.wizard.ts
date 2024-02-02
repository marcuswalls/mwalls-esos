import { inject } from '@angular/core';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';

import { AlternativeComplianceRoutes } from 'esos-api';

export const isWizardCompleted = (alternativeComplianceRoutes?: AlternativeComplianceRoutes) => {
  const store = inject(RequestTaskStore);
  const reportingObligationCategory = store.select(notificationQuery.selectReportingObligationCategory)();
  const complianceRouteDistribution = store.select(notificationQuery.selectReportingObligation)()
    .reportingObligationDetails.complianceRouteDistribution;

  const totalEnergyConsumptionReductionCompleted = alternativeComplianceRoutes?.totalEnergyConsumptionReduction >= 0;

  const energyConsumptionReductionCompleted = !!alternativeComplianceRoutes?.energyConsumptionReduction;

  const energyConsumptionReductionCategoriesCompleted =
    !!alternativeComplianceRoutes?.energyConsumptionReductionCategories &&
    alternativeComplianceRoutes?.energyConsumptionReductionCategories?.total ===
      alternativeComplianceRoutes?.energyConsumptionReduction?.total;

  const assetsCompleted = !!alternativeComplianceRoutes?.assets;

  const iso50001CertificateDetailsCompleted =
    !!alternativeComplianceRoutes?.iso50001CertificateDetails || complianceRouteDistribution.iso50001Pct === 0;

  const decCertificatesDetailsCompleted =
    !!alternativeComplianceRoutes?.decCertificatesDetails ||
    complianceRouteDistribution.displayEnergyCertificatePct === 0;

  const gdaCertificatesDetailsCompleted =
    !!alternativeComplianceRoutes?.gdaCertificatesDetails || complianceRouteDistribution.greenDealAssessmentPct === 0;

  switch (reportingObligationCategory) {
    /**
     * Route B
     */
    case 'ISO_50001_COVERING_ENERGY_USAGE':
      return totalEnergyConsumptionReductionCompleted && assetsCompleted && iso50001CertificateDetailsCompleted;

    /**
     * Route C, E, F
     */
    case 'PARTIAL_ENERGY_ASSESSMENTS':
    case 'LESS_THAN_40000_KWH_PER_YEAR':
    case 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100':
      return (
        energyConsumptionReductionCompleted &&
        energyConsumptionReductionCategoriesCompleted &&
        assetsCompleted &&
        iso50001CertificateDetailsCompleted &&
        decCertificatesDetailsCompleted &&
        gdaCertificatesDetailsCompleted
      );

    default:
      return false;
  }
};
