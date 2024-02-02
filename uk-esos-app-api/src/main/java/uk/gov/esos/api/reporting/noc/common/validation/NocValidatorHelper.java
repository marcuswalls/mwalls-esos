package uk.gov.esos.api.reporting.noc.common.validation;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class NocValidatorHelper {

    public List<NocViolation> extractViolations(final List<NocValidationResult> nocValidationResults) {
        return nocValidationResults.stream()
            .filter(nocValidationResult -> !nocValidationResult.isValid())
            .flatMap(nocValidationResult -> nocValidationResult.getNocViolations().stream())
            .collect(Collectors.toList());
    }
}
