package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class CertificateDetailsTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_validUntil_isAfter_validFrom_valid() {
    	CertificateDetails altRoutes = CertificateDetails.builder()
    		.certificateNumber("test")
            .validFrom(LocalDate.now().minusDays(1))
            .validUntil(LocalDate.now().plusDays(10))
            .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(altRoutes);   
        
        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_when_validUntil_isBefore_validFrom_invalid() {
    	CertificateDetails altRoutes = CertificateDetails.builder()
    			.certificateNumber("test")
                .validFrom(LocalDate.now().minusDays(1))
                .validUntil(LocalDate.now().minusDays(10))
            .build();

        final Set<ConstraintViolation<CertificateDetails>> violations = validator.validate(altRoutes);  
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("{noc.alternativecomplianceroutes.certificate.date}");
    }
}
