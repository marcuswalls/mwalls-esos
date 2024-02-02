package uk.gov.esos.api.verificationbody.domain.dto;

import java.util.HashSet;
import java.util.Set;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.AddressDTO;
import uk.gov.esos.api.common.domain.enumeration.EmissionTradingScheme;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationBodyEditDTO {

    @NotBlank(message = "{verificationBody.name.notEmpty}")
    @Size(max=100, message = "{verificationBody.name.typeMismatch}")
    private String name;

    @NotBlank(message = "{verificationBody.accreditationReferenceNumber.notEmpty}")
    @Size(max=25, message = "{verificationBody.accreditationReferenceNumber.typeMismatch}")
    private String accreditationReferenceNumber;

    @NotNull(message = "{verificationBody.address.notEmpty}")
    @Valid
    private AddressDTO address;

    @Builder.Default
    @NotEmpty
    private Set<EmissionTradingScheme> emissionTradingSchemes = new HashSet<>();
}
