package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;

import java.util.Set;

@Service
public class NocP3ResponsibleUndertakingContextValidatorService extends NocP3SectionValidatorService<ResponsibleUndertaking> implements NocP3SectionContextValidator {

    public NocP3ResponsibleUndertakingContextValidatorService(NocSectionConstraintValidatorService<ResponsibleUndertaking> nocSectionConstraintValidatorService) {
        super(nocSectionConstraintValidatorService);
    }

    @Override
    public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
        ResponsibleUndertaking section = nocContainer.getNoc().getResponsibleUndertaking();
        return this.validate(section, nocContainer, reportingObligationCategory);
    }

    @Override
    public Set<ReportingObligationCategory> getApplicableReportingObligationCategories() {
        return ReportingObligationCategory.getQualifyCategories();
    }

    @Override
    protected String getSectionName() {
        return ResponsibleUndertaking.class.getName();
    }
}
