package uk.gov.esos.api.reporting.noc.common.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.noc.common.domain.NocSection;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NocSectionConstraintValidatorService<T extends NocSection> {

    private final Validator validator;

    public Optional<NocViolation> validate(T nocSection) {
        Set<ConstraintViolation<T>> constraintViolations = validator.validate(nocSection);

        if (!constraintViolations.isEmpty()) {
            NocViolation nocViolation = new NocViolation(
                nocSection.getClass().getName(),
                NocViolation.NocViolationMessage.INVALID_SECTION_DATA,
                constructViolationData(constraintViolations));

            return Optional.of(nocViolation);
        }

        return Optional.empty();
    }

    private List<String> constructViolationData(Set<ConstraintViolation<T>> constraintViolations) {
        List<String> violationData = new ArrayList<>();

        constraintViolations.forEach(constraintViolation ->
            violationData.add(String.format("%s - %s",constraintViolation.getPropertyPath(), constraintViolation.getMessage())));

        return violationData;
    }
}
