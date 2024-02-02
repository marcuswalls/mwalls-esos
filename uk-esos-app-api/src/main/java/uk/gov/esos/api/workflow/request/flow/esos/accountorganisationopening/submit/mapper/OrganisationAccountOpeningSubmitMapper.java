package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningApplicationSubmittedRequestActionPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface OrganisationAccountOpeningSubmitMapper {

    OrganisationAccountDTO toAccountOrganisationDTO(OrganisationAccountPayload accountPayload);

    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType.ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD)")
    OrganisationAccountOpeningRequestPayload toOrganisationAccountOpeningRequestPayload(OrganisationAccountPayload account, OrganisationParticipantDetails participantDetails, String operatorAssignee);

    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED_PAYLOAD)")
    OrganisationAccountOpeningApplicationSubmittedRequestActionPayload toOrganisationAccountOpeningApplicationSubmittedRequestActionPayload(OrganisationAccountPayload account, OrganisationParticipantDetails participantDetails);
}
