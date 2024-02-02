package uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ComplianceRouteDistributionTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_valid() {
        ComplianceRouteDistribution complianceRouteDistribution = ComplianceRouteDistribution.builder()
            .iso50001Pct(10)
            .greenDealAssessmentPct(0)
            .displayEnergyCertificatePct(20)
            .energyAuditsPct(65)
            .energyNotAuditedPct(5)
            .totalPct(100)
            .build();

        Set<ConstraintViolation<ComplianceRouteDistribution>> violations = validator.validate(complianceRouteDistribution);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_sum_less_than_100_invalid() {
        ComplianceRouteDistribution complianceRouteDistribution = ComplianceRouteDistribution.builder()
            .iso50001Pct(10)
            .greenDealAssessmentPct(8)
            .displayEnergyCertificatePct(20)
            .energyAuditsPct(50)
            .energyNotAuditedPct(5)
            .totalPct(100)
            .build();

        Set<ConstraintViolation<ComplianceRouteDistribution>> violations = validator.validate(complianceRouteDistribution);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.complianceRouteDistribution.sum}");
    }

    @Test
    void validate_when_sum_more_than_100_invalid() {
        ComplianceRouteDistribution complianceRouteDistribution = ComplianceRouteDistribution.builder()
            .iso50001Pct(10)
            .greenDealAssessmentPct(18)
            .displayEnergyCertificatePct(20)
            .energyAuditsPct(50)
            .energyNotAuditedPct(5)
            .totalPct(100)
            .build();

        Set<ConstraintViolation<ComplianceRouteDistribution>> violations = validator.validate(complianceRouteDistribution);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage).containsExactly("{noc.complianceRouteDistribution.sum}");
    }

}