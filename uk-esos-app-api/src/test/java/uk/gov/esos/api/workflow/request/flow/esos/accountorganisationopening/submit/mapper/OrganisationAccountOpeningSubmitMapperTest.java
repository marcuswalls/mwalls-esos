package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.mapper;

import org.assertj.core.api.AssertionsForInterfaceTypes;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningApplicationSubmittedRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.mapper.OrganisationAccountOpeningSubmitMapper;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class OrganisationAccountOpeningSubmitMapperTest {

    private final OrganisationAccountOpeningSubmitMapper mapper = Mappers.getMapper(OrganisationAccountOpeningSubmitMapper.class);

    @Test
    void toAccountOrganisationDTO() {
        final String accountName = "accountName";
        final CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        final String regNum = "number";
        final CountyAddressDTO addressDTO = CountyAddressDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build();

        OrganisationAccountPayload accountPayload = createAccountPayload(accountName, competentAuthority,regNum,addressDTO);

        OrganisationAccountDTO accountDTO = mapper.toAccountOrganisationDTO(accountPayload);

        assertThat(accountDTO.getName()).isEqualTo(accountName);
        assertThat(accountDTO.getRegistrationNumber()).isEqualTo(regNum);
        assertThat(accountDTO.getAddress()).isEqualTo(addressDTO);
        AssertionsForInterfaceTypes.assertThat(accountDTO.getCompetentAuthority()).isEqualTo(competentAuthority);
    }

    @Test
    void toOrganisationAccountOpeningRequestPayload() {
        final String accountName = "account";
        final CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.WALES;
        final String participantAssignee = "participantAssignee";
        final String regNum = "registrationNumber";
        final CountyAddressDTO addressDTO = CountyAddressDTO.builder()
                .line1("line1")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build();

        OrganisationAccountPayload accountPayload = createAccountPayload(accountName, competentAuthority,regNum,addressDTO);
        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
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
       OrganisationAccountOpeningRequestPayload requestPayload =
                mapper.toOrganisationAccountOpeningRequestPayload(accountPayload, participantDetails, participantAssignee);

       // Verify
        assertThat(requestPayload.getPayloadType()).isEqualTo(RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD);
        assertThat((requestPayload.getOperatorAssignee())).isEqualTo(participantAssignee);
        assertThat(requestPayload.getAccount()).isEqualTo(accountPayload);
        assertThat(requestPayload.getParticipantDetails()).isEqualTo(participantDetails);
    }

    @Test
    void toOrganisationAccountOpeningApplicationSubmittedRequestActionPayload() {
        final String accountName = "account1";
        final CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.SCOTLAND;
        final String regNum = "num";
        final CountyAddressDTO addressDTO = CountyAddressDTO.builder()
                .line1("line1")
                .line2("address line 2")
                .city("city")
                .county("county")
                .postcode("postcode")
                .build();

        OrganisationAccountPayload accountPayload = createAccountPayload(accountName, competentAuthority,regNum,addressDTO);
        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .jobTitle("Job")
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
        OrganisationAccountOpeningApplicationSubmittedRequestActionPayload accountSubmittedPayload = mapper
                .toOrganisationAccountOpeningApplicationSubmittedRequestActionPayload(accountPayload, participantDetails);

        // Verify
        assertThat(accountSubmittedPayload).isInstanceOf(OrganisationAccountOpeningApplicationSubmittedRequestActionPayload.class);
        assertThat(accountSubmittedPayload.getPayloadType()).isEqualTo(RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED_PAYLOAD);
        assertThat(accountSubmittedPayload.getAccount()).isEqualTo(accountPayload);
        assertThat(accountSubmittedPayload.getParticipantDetails()).isEqualTo(participantDetails);
    }

    private OrganisationAccountPayload createAccountPayload(String accountName, CompetentAuthorityEnum ca, String registrationNumber, CountyAddressDTO addressDTO) {
        return OrganisationAccountPayload.builder()
                .name(accountName)
                .competentAuthority(ca)
                .registrationNumber(registrationNumber)
                .address(addressDTO)
                .build();
    }
}
