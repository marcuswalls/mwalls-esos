package uk.gov.esos.api.workflow.request.core.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganisationParticipantDetails {

    private String firstName;
    private String lastName;
    private String jobTitle;
    private String email;
    private PhoneNumberDTO phoneNumber;
    private PhoneNumberDTO mobileNumber;

    @JsonUnwrapped
    private CountyAddressDTO address;
}
