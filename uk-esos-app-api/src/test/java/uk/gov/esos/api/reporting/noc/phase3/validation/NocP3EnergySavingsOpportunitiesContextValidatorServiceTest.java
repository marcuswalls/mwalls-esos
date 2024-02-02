package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumption;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategories;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energysavingsopportunities.EnergySavingsOpportunities;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3EnergySavingsOpportunitiesContextValidatorServiceTest {

    @InjectMocks
    private NocP3EnergySavingsOpportunitiesContextValidatorService contextValidator;

    @Mock
    private NocSectionConstraintValidatorService<EnergySavingsOpportunities> nocSectionConstraintValidatorService;

    @Test
    void validate() {
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
            .energyConsumption(EnergyConsumption.builder().total(200).build())
            .energySavingsCategories(EnergySavingsCategories.builder().total(200).build())
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(energySavingsOpportunities)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsOpportunities);
    }

    @Test
    void validate_not_valid_for_category() {
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
            .energyConsumption(EnergyConsumption.builder().build())
            .energySavingsCategories(EnergySavingsCategories.builder().build())
            .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        // Invoke
        NocValidationResult result = contextValidator
                .validate(nocContainer, ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
                .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
                .containsOnly(EnergySavingsOpportunities.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validateSection_invalid_total() {
        final EnergySavingsOpportunities energySavingsOpportunities = EnergySavingsOpportunities.builder()
                .energySavingsCategories(EnergySavingsCategories.builder().total(150).build())
                .energyConsumption(EnergyConsumption.builder().total(120).build())
                .build();
        final NocP3Container nocContainer = NocP3Container.builder()
                .noc(NocP3.builder()
                        .energySavingsOpportunities(energySavingsOpportunities)
                        .build())
                .build();

        when(nocSectionConstraintValidatorService.validate(energySavingsOpportunities)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidator
            .validate(nocContainer, ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_ENERGY_SAVINGS_OPPORTUNITIES_TOTAL.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(EnergySavingsOpportunities.class.getName());

        verify(nocSectionConstraintValidatorService, times(1)).validate(energySavingsOpportunities);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidator.getApplicableReportingObligationCategories()).containsExactlyInAnyOrder(
                ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
                ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
                ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR
        );
    }
}
