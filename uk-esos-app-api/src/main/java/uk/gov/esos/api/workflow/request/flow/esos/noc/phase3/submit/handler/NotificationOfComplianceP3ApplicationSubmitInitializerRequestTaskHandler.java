package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.handler;

import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.ObjectUtils;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.service.OrganisationAccountDetailsQueryService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.transform.NotificationOfComplianceP3SubmitMapper;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3ApplicationSubmitInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    private final OrganisationAccountDetailsQueryService organisationAccountDetailsQueryService;
    private static final NotificationOfComplianceP3SubmitMapper NOTIFICATION_OF_COMPLIANCE_P_3_SUBMIT_MAPPER =
            Mappers.getMapper(NotificationOfComplianceP3SubmitMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final NotificationOfComplianceP3RequestPayload requestPayload =
                (NotificationOfComplianceP3RequestPayload) request.getPayload();

        if(ObjectUtils.isEmpty(requestPayload.getNoc())) {
            return initializeTaskPayload(request.getAccountId());
        }

        return NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                .accountOriginatedData(requestPayload.getAccountOriginatedData())
                .noc(requestPayload.getNoc())
                .nocSectionsCompleted(requestPayload.getNocSectionsCompleted())
                .nocAttachments(requestPayload.getNocAttachments())
                .build();
    }

    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);
    }

    private NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload initializeTaskPayload(Long accountId) {
        OrganisationDetails organisationDetails = organisationAccountDetailsQueryService
                .getOrganisationDetails(accountId);

        OrganisationParticipantDetails primaryContact = organisationAccountDetailsQueryService
                .getOrganisationPrimaryContactParticipantDetails(accountId);
        Optional<ContactPerson> secondaryContact = organisationAccountDetailsQueryService
                .getOrganisationSecondaryContactParticipantDetails(accountId)
                .map(NOTIFICATION_OF_COMPLIANCE_P_3_SUBMIT_MAPPER::toContactPerson);

        return NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                .accountOriginatedData(AccountOriginatedData.builder()
                        .organisationDetails(organisationDetails)
                        .primaryContact(NOTIFICATION_OF_COMPLIANCE_P_3_SUBMIT_MAPPER.toContactPerson(primaryContact))
                        .secondaryContact(secondaryContact.orElse(null))
                        .build())
                .build();
    }
}
