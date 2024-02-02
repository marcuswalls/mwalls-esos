package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities.EnergySavingsOpportunities;

import java.util.List;
import java.util.Set;

@Service
public class NocP3EnergySavingsOpportunitiesContextValidatorService extends NocP3SectionValidatorService<EnergySavingsOpportunities> implements NocP3SectionContextValidator {

    public NocP3EnergySavingsOpportunitiesContextValidatorService(NocSectionConstraintValidatorService<EnergySavingsOpportunities> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        EnergySavingsOpportunities section = nocContainer.getNoc().getEnergySavingsOpportunities();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    protected List<NocViolation> validateSection(EnergySavingsOpportunities nocSection, NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        List<NocViolation> nocViolations = super.validateSection(nocSection, nocContainer, reportingObligationCategory);

        if (nocSection.getEnergyConsumption().getTotal().compareTo(nocSection.getEnergySavingsCategories().getTotal()) != 0) {
            nocViolations.add(new NocViolation(this.getSectionName(), NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_OPPORTUNITIES_TOTAL));
        }
        return nocViolations;
    }

    @Override
    protected Set<ReportingObligationCategory> getApplicableReportingObligationCategories() {
        return Set.of(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR
        );
    }

    @Override
    protected String getSectionName() {
        return EnergySavingsOpportunities.class.getName();
    }
}
