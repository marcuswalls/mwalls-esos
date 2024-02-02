package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.Decision;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.AccountOpeningDecisionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningDecisionSubmittedRequestActionPayload;

import static org.junit.jupiter.api.Assertions.assertEquals;

class OrganisationAccountOpeningReviewMapperTest {

    private final OrganisationAccountOpeningReviewMapper mapper = Mappers.getMapper(OrganisationAccountOpeningReviewMapper.class);

    @Test
    void toOrganisationAccountOpeningApplicationRequestTaskPayload() {
        OrganisationAccountPayload account = OrganisationAccountPayload.builder()
            .name("name")
            .registrationNumber("nbr")
            .competentAuthority(CompetentAuthorityEnum.WALES)
            .address(CountyAddressDTO.builder()
                .line1("line1")
                .city("city")
                .county("county")
                .postcode("code")
                .build())
            .build();
        OrganisationParticipantDetails userDetails = OrganisationParticipantDetails.builder()
            .firstName("fname")
            .lastName("lname")
            .jobTitle("officer")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("code").number("101").build())
            .build();
        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .account(account)
            .participantDetails(userDetails)
            .build();

        OrganisationAccountOpeningApplicationRequestTaskPayload expected =
            OrganisationAccountOpeningApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD)
                .account(account)
                .participantDetails(userDetails)
                .build();

        //invoke
        OrganisationAccountOpeningApplicationRequestTaskPayload actual = mapper.toOrganisationAccountOpeningApplicationRequestTaskPayload(requestPayload);

        //verify
        assertEquals(expected, actual);
    }

    @Test
    void toOrganisationAccountOpeningDecisionSubmittedRequestActionPayload() {
        OrganisationAccountPayload account = OrganisationAccountPayload.builder()
            .name("name")
            .registrationNumber("nbr")
            .competentAuthority(CompetentAuthorityEnum.WALES)
            .address(CountyAddressDTO.builder()
                .line1("line1")
                .city("city")
                .county("county")
                .postcode("code")
                .build())
            .build();
        OrganisationParticipantDetails userDetails = OrganisationParticipantDetails.builder()
            .firstName("fname")
            .lastName("lname")
            .jobTitle("officer")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("code").number("101").build())
            .build();
        AccountOpeningDecisionPayload decision = AccountOpeningDecisionPayload.builder().decision(Decision.REJECTED).reason("reason").build();
        OrganisationAccountOpeningRequestPayload requestPayload = OrganisationAccountOpeningRequestPayload.builder()
            .account(account)
            .participantDetails(userDetails)
            .decision(decision)
            .build();

        OrganisationAccountOpeningDecisionSubmittedRequestActionPayload expected =
            OrganisationAccountOpeningDecisionSubmittedRequestActionPayload.builder()
                .payloadType(RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_DECISION_SUBMITTED_PAYLOAD)
                .account(account)
                .participantDetails(userDetails)
                .decision(decision)
                .build();

        //invoke
        OrganisationAccountOpeningDecisionSubmittedRequestActionPayload actual = mapper.toOrganisationAccountOpeningDecisionSubmittedRequestActionPayload(requestPayload);

        //verify
        assertEquals(expected, actual);
    }
}