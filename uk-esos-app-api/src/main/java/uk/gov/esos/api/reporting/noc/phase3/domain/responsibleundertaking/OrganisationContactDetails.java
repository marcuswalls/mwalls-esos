package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisationContactDetails {

    @Email
    @Size(max = 255)
    @NotBlank
    private String email;

    @NotNull
    @Valid
    private PhoneNumberDTO phoneNumber;
}
