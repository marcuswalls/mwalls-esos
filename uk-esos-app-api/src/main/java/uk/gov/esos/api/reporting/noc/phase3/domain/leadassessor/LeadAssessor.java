package uk.gov.esos.api.reporting.noc.phase3.domain.leadassessor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadAssessor implements NocP3Section {

	@NotNull
	private LeadAssessorType leadAssessorType;
	
	@NotNull
	private Boolean hasLeadAssessorConfirmation;
	
	@NotNull
	@Valid
	private LeadAssessorDetails leadAssessorDetails;
}
