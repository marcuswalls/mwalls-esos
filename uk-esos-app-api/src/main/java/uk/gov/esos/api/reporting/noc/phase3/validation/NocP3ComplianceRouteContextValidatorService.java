package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute.ComplianceRoute;

import java.util.List;
import java.util.Set;

@Service
public class NocP3ComplianceRouteContextValidatorService extends NocP3SectionValidatorService<ComplianceRoute> implements NocP3SectionContextValidator {

    public NocP3ComplianceRouteContextValidatorService(NocSectionConstraintValidatorService<ComplianceRoute> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
		ComplianceRoute section = nocContainer.getNoc().getComplianceRoute();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(ComplianceRoute nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        return switch (reportingObligationCategory){
            case ISO_50001_COVERING_ENERGY_USAGE, ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100 -> {
                // Hide QID20, QID21, QID22, QID23, QID25
                validateEnergyConsumptionData(nocSection, nocViolations);

                yield nocViolations;
            }
            case ESOS_ENERGY_ASSESSMENTS_95_TO_100, PARTIAL_ENERGY_ASSESSMENTS, LESS_THAN_40000_KWH_PER_YEAR -> {
                // validate that TwelveMonthsVerifiableData should exist if areDataEstimated is false
                validateTwelveMonthsVerifiableData(nocSection, nocViolations);

                yield nocViolations;
            }
            default -> nocViolations;
        };
    }

	@Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories() {
        return Set.of(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
                ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }

    @Override
    protected String getSectionName() {
        return ComplianceRoute.class.getName();
    }
    
    private void validateEnergyConsumptionData(ComplianceRoute nocSection, List<NocViolation> nocViolations) {
    	if(ObjectUtils.isNotEmpty(nocSection.getTwelveMonthsVerifiableDataUsed())
                || ObjectUtils.isNotEmpty(nocSection.getEnergyConsumptionProfilingUsed())
                || nocSection.getAreEnergyConsumptionProfilingMethodsRecorded() != null
                || CollectionUtils.isNotEmpty(nocSection.getEnergyAudits())) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_CONSUMPTION_DATA));
        }
	}
    
    private void validateTwelveMonthsVerifiableData(ComplianceRoute nocSection, List<NocViolation> nocViolations) {
    	if((Boolean.FALSE.equals(nocSection.getAreDataEstimated())
                && ObjectUtils.isEmpty(nocSection.getTwelveMonthsVerifiableDataUsed()))
                || (Boolean.TRUE.equals(nocSection.getAreDataEstimated()
                && ObjectUtils.isNotEmpty(nocSection.getTwelveMonthsVerifiableDataUsed())))) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_TWELVE_MONTHS_VERIFIABLE_DATA));
        }
	}
}
