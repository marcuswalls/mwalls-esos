package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.common.validation.NocSectionConstraintValidatorService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.energyconsumptiondetails.EnergyConsumptionDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3EnergyConsumptionDetailsContextValidatorServiceTest {

    @InjectMocks
    private NocP3EnergyConsumptionDetailsContextValidatorService contextValidatorService;

    @Mock
    private NocSectionConstraintValidatorService<EnergyConsumptionDetails> nocSectionConstraintValidatorService;

    @Test
    void validate_valid() {
        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder().build();
        NocP3Container nocContainer = NocP3Container.builder()
            .noc(NocP3.builder()
                .energyConsumptionDetails(energyConsumptionDetails)
                .build())
            .build();

        when(nocSectionConstraintValidatorService.validate(energyConsumptionDetails)).thenReturn(Optional.empty());

        // Invoke
        NocValidationResult result = contextValidatorService
            .validate(nocContainer, ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100);

        // Verify
        assertThat(result.isValid()).isTrue();

        verify(nocSectionConstraintValidatorService, times(1)).validate(energyConsumptionDetails);
    }

    @Test
    void validate_invalid_when_section_should_not_exist() {
        EnergyConsumptionDetails energyConsumptionDetails = EnergyConsumptionDetails.builder().build();
        NocP3Container nocContainer = NocP3Container.builder()
            .noc(NocP3.builder()
                .energyConsumptionDetails(energyConsumptionDetails)
                .build())
            .build();

        // Invoke
        NocValidationResult result = contextValidatorService
            .validate(nocContainer, ReportingObligationCategory.ZERO_ENERGY);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(EnergyConsumptionDetails.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void validate_invalid_when_section_should_exist() {
        NocP3Container nocContainer = NocP3Container.builder()
            .noc(NocP3.builder().build())
            .build();

        // Invoke
        NocValidationResult result = contextValidatorService
            .validate(nocContainer, ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR);

        // Verify
        assertThat(result.isValid()).isFalse();
        assertThat(result.getNocViolations()).extracting(NocViolation::getMessage)
            .containsOnly(NocViolation.NocViolationMessage.INVALID_SECTION.getMessage());
        assertThat(result.getNocViolations()).extracting(NocViolation::getSectionName)
            .containsOnly(EnergyConsumptionDetails.class.getName());

        verifyNoInteractions(nocSectionConstraintValidatorService);
    }

    @Test
    void getApplicableReportingObligationCategories() {
        assertThat(contextValidatorService.getApplicableReportingObligationCategories()).containsExactlyInAnyOrder(
            ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100,
            ReportingObligationCategory.ISO_50001_COVERING_ENERGY_USAGE,
            ReportingObligationCategory.PARTIAL_ENERGY_ASSESSMENTS,
            ReportingObligationCategory.LESS_THAN_40000_KWH_PER_YEAR,
            ReportingObligationCategory.ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100
        );
    }

    @Test
    void getSectionName() {
        assertThat(contextValidatorService.getSectionName()).endsWith("EnergyConsumptionDetails");
    }
}