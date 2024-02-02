package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningApplicationReviewInitializerTest {

    private final OrganisationAccountOpeningApplicationReviewInitializer initializer = new OrganisationAccountOpeningApplicationReviewInitializer();

    @Test
    void initializePayload() {
        CountyAddressDTO accountAddress = CountyAddressDTO.builder()
            .line1("line1")
            .city("Manchester")
            .county("county")
            .postcode("123")
            .build();
        OrganisationAccountPayload accountPayload = OrganisationAccountPayload.builder()
            .name("energy")
            .registrationNumber("009701")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .address(accountAddress)
            .build();
        CountyAddressDTO userAddress = CountyAddressDTO.builder()
            .line1("line20")
            .city("Brighton")
            .county("county")
            .postcode("456")
            .build();
        OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
            .firstName("fname")
            .lastName("lname")
            .jobTitle("admin")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("30").number("2130909876").build())
            .address(userAddress)
            .build();
        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .account(accountPayload)
            .participantDetails(participantDetails)
            .build();
        Request request = Request.builder().payload(requestPayload).build();

        OrganisationAccountOpeningApplicationRequestTaskPayload expected =
            OrganisationAccountOpeningApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD)
                .account(accountPayload)
                .participantDetails(participantDetails)
                .build();

        //invoke
        RequestTaskPayload actual = initializer.initializePayload(request);

        //assert
        assertThat(actual).isInstanceOf(OrganisationAccountOpeningApplicationRequestTaskPayload.class);
        assertEquals(expected, actual);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsOnly(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    }
}