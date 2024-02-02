package uk.gov.esos.api.verificationbody.domain.verificationbodydetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.AddressDTO;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerificationBodyDetails {

    private String name;
    private String accreditationReferenceNumber;
    private AddressDTO address;

    @Builder.Default
    private Set<EmissionTradingScheme> emissionTradingSchemes = new HashSet<>();
}
