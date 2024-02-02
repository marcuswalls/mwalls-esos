package uk.gov.esos.api.reporting.noc.phase3.validation;

import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;

public interface NocP3SectionContextValidator {

    NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory);
}
