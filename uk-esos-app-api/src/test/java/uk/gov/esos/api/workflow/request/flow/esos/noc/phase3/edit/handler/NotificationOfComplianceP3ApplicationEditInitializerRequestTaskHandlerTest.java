package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.domain.NotificationOfComplianceP3ApplicationEditRequestTaskPayload;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplicationEditInitializerRequestTaskHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplicationEditInitializerRequestTaskHandler handler;

    @Test
    void initializePayload() {
        final Map<String, String> nocSectionsCompleted = Map.of("key", "completed");
        final Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "test.png");
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
        final NocP3 noc = NocP3.builder()
                .responsibleUndertaking(ResponsibleUndertaking.builder()
                        .organisationDetails(ReviewOrganisationDetails.builder()
                                .name("Name")
                                .registrationNumber("R8282")
                                .build())
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

        final NotificationOfComplianceP3ApplicationEditRequestTaskPayload expected =
                NotificationOfComplianceP3ApplicationEditRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT_PAYLOAD)
                        .accountOriginatedData(accountOriginatedData)
                        .noc(noc)
                        .nocSectionsCompleted(nocSectionsCompleted)
                        .nocAttachments(nocAttachments)
                        .build();

        // Invoke
        RequestTaskPayload actual = handler.initializePayload(request);

        // Verify
        assertThat(actual)
                .isInstanceOf(NotificationOfComplianceP3ApplicationEditRequestTaskPayload.class)
                .isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getRequestTaskTypes()).containsExactly(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT);
    }
}
