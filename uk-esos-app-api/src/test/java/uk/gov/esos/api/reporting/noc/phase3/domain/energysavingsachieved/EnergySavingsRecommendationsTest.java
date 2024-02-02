package uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsachieved;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class EnergySavingsRecommendationsTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        EnergySavingsRecommendations energySavingsRecommendations = EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(30)
                .other(50)
                .total(100)
                .build();

        Set<ConstraintViolation<EnergySavingsRecommendations>> violations = validator.validate(energySavingsRecommendations);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_sum_less_than_100_invalid() {
        EnergySavingsRecommendations energySavingsRecommendations = EnergySavingsRecommendations.builder()
                .energyAudits(10)
                .alternativeComplianceRoutes(30)
                .other(40)
                .total(100)
                .build();

        Set<ConstraintViolation<EnergySavingsRecommendations>> violations = validator.validate(energySavingsRecommendations);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energysavingsachieved.energySavingsRecommendations.sum}");
    }

    @Test
    void validate_when_sum_more_than_100_invalid() {
        EnergySavingsRecommendations energySavingsRecommendations = EnergySavingsRecommendations.builder()
                .energyAudits(20)
                .alternativeComplianceRoutes(40)
                .other(50)
                .total(100)
                .build();

        Set<ConstraintViolation<EnergySavingsRecommendations>> violations = validator.validate(energySavingsRecommendations);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.energysavingsachieved.energySavingsRecommendations.sum}");
    }
}
