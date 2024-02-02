package uk.gov.esos.api.workflow.request.core.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class OrganisationAccountDetailsMapperTest {

    private final OrganisationAccountDetailsMapper mapper = Mappers
            .getMapper(OrganisationAccountDetailsMapper.class);

    @Test
    void toOrganisationParticipantDetails() {
        final OperatorUserDTO operatorUserDTO = OperatorUserDTO.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
                .email("fname@email.uk")
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2101313131")
                        .build())
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();
        final OrganisationParticipantDetails expected = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
                .email("fname@email.uk")
                .phoneNumber(PhoneNumberDTO.builder()
                        .countryCode("30")
                        .number("2101313131")
                        .build())
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();

        // Invoke
        OrganisationParticipantDetails actual = mapper.toOrganisationParticipantDetails(operatorUserDTO);

        // Verify
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void toOrganisationDetails() {
        final OrganisationAccountDTO organisationAccountDTO = OrganisationAccountDTO.builder()
                .name("Name")
                .registrationNumber("R8282")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();
        final OrganisationDetails expected = OrganisationDetails.builder()
                .name("Name")
                .registrationNumber("R8282")
                .address(CountyAddressDTO.builder()
                        .line1("line1")
                        .line2("line2")
                        .city("city")
                        .county("county")
                        .postcode("postcode")
                        .build())
                .build();

        // Invoke
        OrganisationDetails actual = mapper.toOrganisationDetails(organisationAccountDTO);

        // Verify
        assertThat(actual).isEqualTo(expected);
    }
}
