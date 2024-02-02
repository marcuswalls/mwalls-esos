package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assets {

	@Size(max = 10000)
	private String iso50001;
	
	@Size(max = 10000)
	private String dec;
	
	@Size(max = 10000)
	private String gda;
	
}
