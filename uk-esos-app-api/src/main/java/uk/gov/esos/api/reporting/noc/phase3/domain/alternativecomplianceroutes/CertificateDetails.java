package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#validFrom == null) || (#validUntil == null) || " +
	    "T(java.time.LocalDate).parse(#validUntil).isAfter(T(java.time.LocalDate).parse(#validFrom))}",
	    message = "noc.alternativecomplianceroutes.certificate.date")
public class CertificateDetails {

	@NotBlank
	@Size(max = 10000)
	private String certificateNumber;
	
	@NotNull
	@Past
	private LocalDate validFrom;
	
	@NotNull
	private LocalDate validUntil;
}
