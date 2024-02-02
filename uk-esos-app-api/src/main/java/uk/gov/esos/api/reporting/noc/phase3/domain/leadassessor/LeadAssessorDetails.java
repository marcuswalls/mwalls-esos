package uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadAssessorDetails {

	@NotBlank
    @Size(max = 255)
	private String firstName;
	
	@NotBlank
    @Size(max = 255)
	private String lastName;
	
	@Email
    @Size(max = 255)
    @NotBlank
	private String email;
	
	@NotNull
	private ProfessionalBodyType professionalBody;
	
	@NotNull
	@Size(max = 255)
	private String membershipNumber;
}
