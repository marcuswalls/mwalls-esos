package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.OrganisationAccountDetailsQueryService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplicationSubmitInitializerRequestTaskHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplicationSubmitInitializerRequestTaskHandler handler;

    @Mock
    private OrganisationAccountDetailsQueryService organisationAccountDetailsQueryService;

    @Test
    void initializePayload() {
        final long accountId = 1L;
        final Request request = Request.builder()
                .accountId(accountId)
                .payload(NotificationOfComplianceP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                        .build())
                .build();
        final OrganisationDetails organisationDetails = OrganisationDetails.builder()
                .name("Name")
                .registrationNumber("R8282")
                .build();
        final AccountOriginatedData accountOriginatedData = AccountOriginatedData.builder()
                .organisationDetails(organisationDetails)
                .primaryContact(ContactPerson.builder()
                        .firstName("FirstName")
                        .lastName("LastName")
                        .build())
                .build();
        final OrganisationParticipantDetails participantDetails = OrganisationParticipantDetails.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .build();

        final NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload expected =
                NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .accountOriginatedData(accountOriginatedData)
                        .build();

        when(organisationAccountDetailsQueryService.getOrganisationDetails(accountId))
                .thenReturn(organisationDetails);
        when(organisationAccountDetailsQueryService.getOrganisationPrimaryContactParticipantDetails(accountId))
                .thenReturn(participantDetails);
        when(organisationAccountDetailsQueryService.getOrganisationSecondaryContactParticipantDetails(accountId))
                .thenReturn(Optional.empty());

        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.class)
                .isEqualTo(expected);
        verify(organisationAccountDetailsQueryService, times(1)).getOrganisationDetails(accountId);
        verify(organisationAccountDetailsQueryService, times(1)).getOrganisationPrimaryContactParticipantDetails(accountId);
        verify(organisationAccountDetailsQueryService, times(1)).getOrganisationSecondaryContactParticipantDetails(accountId);
    }

    @Test
    void initializePayload_from_request() {
        final Map<String, String> nocSectionsCompleted = Map.of("key", "completed");
        final Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "test.png");
        final NocP3 noc = NocP3.builder()
                .responsibleUndertaking(ResponsibleUndertaking.builder()
                        .organisationDetails(ReviewOrganisationDetails.builder()
                                .name("Name")
                                .registrationNumber("R8282")
                                .build())
                        .build())
                .build();
        final AccountOriginatedData accountOriginatedData = AccountOriginatedData.builder()
                .organisationDetails(OrganisationDetails.builder()
                        .name("Name")
                        .registrationNumber("R8282")
                        .build())
                .primaryContact(ContactPerson.builder()
                        .firstName("FirstName")
                        .lastName("LastName")
                        .build())
                .secondaryContact(ContactPerson.builder()
                        .firstName("SecondFirstName")
                        .lastName("SecondLastName")
                        .build())
                .build();

        final Request request = Request.builder()
                .payload(NotificationOfComplianceP3RequestPayload.builder()
                        .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                        .accountOriginatedData(accountOriginatedData)
                        .noc(noc)
                        .nocSectionsCompleted(nocSectionsCompleted)
                        .nocAttachments(nocAttachments)
                        .build())
                .build();

        final NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload expected =
                NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .accountOriginatedData(accountOriginatedData)
                        .noc(noc)
                        .nocSectionsCompleted(nocSectionsCompleted)
                        .nocAttachments(nocAttachments)
                        .build();

        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.class)
                .isEqualTo(expected);
        verifyNoInteractions(organisationAccountDetailsQueryService);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT);
    }
}
