package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificatesDetails {
	
	@Valid
    @NotEmpty
    @Builder.Default
	List<CertificateDetails> certificateDetails = new ArrayList<>();
}
