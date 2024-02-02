import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { CertificateDetailsStep } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.types';
import { validUntilLaterThanValidFromValidator } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.validators';

import { GovukValidators } from 'govuk-components';

import { CertificateDetails, ComplianceRouteDistribution } from 'esos-api';

export const ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK = 'alternativeComplianceRoutes';

export enum CurrentStep {
  TOTAL_ENERGY_CONSUMPTION_REDUCTION = 'totalEnergyConsumptionReduction',
  ENERGY_CONSUMPTION_REDUCTION = 'energyConsumptionReduction',
  ENERGY_CONSUMPTION_REDUCTION_CATEGORIES = 'energyConsumptionReductionCategories',
  ASSETS = 'assets',
  ISO_50001_CERTIFICATE_DETAILS = 'iso50001CertificateDetails',
  DEC_CERTIFICATES_DETAILS = 'decCertificatesDetails',
  GDA_CERTIFICATES_DETAILS = 'gdaCertificatesDetails',
  SUMMARY = 'summary',
}

export enum WizardStep {
  TOTAL_ENERGY_CONSUMPTION_REDUCTION = 'total-energy-consumption-reduction',
  ENERGY_CONSUMPTION_REDUCTION = 'energy-consumption-reduction',
  ENERGY_CONSUMPTION_REDUCTION_CATEGORIES = 'energy-consumption-reduction-categories',
  ASSETS = 'assets',
  ISO_50001_CERTIFICATE_DETAILS = 'iso-50001-certificate-details',
  DEC_CERTIFICATES_DETAILS = 'dec-certificates-details',
  GDA_CERTIFICATES_DETAILS = 'gda-certificates-details',
  SUMMARY = '../',
}

export const addCertificateDetailsGroup = (
  step: CertificateDetailsStep,
  certificateDetails?: CertificateDetails,
): UntypedFormGroup => {
  return new UntypedFormGroup(
    {
      certificateNumber: new UntypedFormControl(certificateDetails?.certificateNumber ?? null, {
        validators: GovukValidators.required(getCertificateNumberErrorMessage(step)),
      }),
      validFrom: new UntypedFormControl(
        certificateDetails?.validFrom ? new Date(certificateDetails?.validFrom) : null,
        {
          validators: GovukValidators.required('Enter a date'),
        },
      ),
      validUntil: new UntypedFormControl(
        certificateDetails?.validUntil ? new Date(certificateDetails?.validUntil) : null,
        {
          validators: GovukValidators.required('Enter a date'),
        },
      ),
    },
    {
      updateOn: 'change',
      validators: [validUntilLaterThanValidFromValidator()],
    },
  );
};

const getCertificateNumberErrorMessage = (step: CertificateDetailsStep): string => {
  switch (step) {
    case 'decCertificatesDetails':
      return 'Enter a Display Energy Certificate number';
    case 'gdaCertificatesDetails':
      return 'Enter a Green Deal Assessment Certificate number';
    default:
      return 'Enter an ISO 50001 Certificate number';
  }
};

export const isIso50001Enabled = (complianceRouteDistribution: ComplianceRouteDistribution) => {
  return complianceRouteDistribution.iso50001Pct > 0;
};

export const isDecEnabled = (complianceRouteDistribution: ComplianceRouteDistribution) => {
  return complianceRouteDistribution.displayEnergyCertificatePct > 0;
};

export const isGdaEnabled = (complianceRouteDistribution: ComplianceRouteDistribution) => {
  return complianceRouteDistribution.greenDealAssessmentPct > 0;
};
