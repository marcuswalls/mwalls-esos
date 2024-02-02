package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ReturnToSubmitServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3ReturnToSubmitService service;

    @Mock
    private RequestService requestService;

    @Test
    void applyReturnToSubmitAction() {
        String selectedAssignee = "selected assigne";
        final Map<String, String> nocSectionsCompleted = Map.of("key", "completed");
        final Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "test.png");
        final NocP3 noc = NocP3.builder()
            .responsibleUndertaking(ResponsibleUndertaking.builder()
                .organisationDetails(ReviewOrganisationDetails.builder()
                    .name("Organisation name")
                    .build())
                .build())
            .build();
        Request request = Request.builder()
            .type(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)
            .payload(NotificationOfComplianceP3RequestPayload.builder()
                .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                .supportingOperator(selectedAssignee)
                .build())
            .build();
        final RequestTask requestTask = RequestTask.builder()
            .type(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .request(request)
            .payload(NotificationOfComplianceP3ApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                .noc(noc)
                .nocAttachments(nocAttachments)
                .nocSectionsCompleted(nocSectionsCompleted)
                .build())
            .build();

        final NotificationOfComplianceP3ApplicationRequestActionPayload requestActionPayload = NotificationOfComplianceP3ApplicationRequestActionPayload.builder()
            .payloadType(RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT_PAYLOAD)
            .noc(noc)
            .nocAttachments(nocAttachments)
            .build();
        // Invoke
        service.applyReturnToSubmitAction(requestTask);

        // Verify
        assertThat(request.getPayload()).isInstanceOf(NotificationOfComplianceP3RequestPayload.class);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocSectionsCompleted())
            .isEqualTo(nocSectionsCompleted);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocAttachments())
            .isEqualTo(nocAttachments);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNoc())
            .isEqualTo(noc);

        // Verify
        verify(requestService, times(1)).addActionToRequest(request,
            requestActionPayload,
            RequestActionType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT,
            selectedAssignee
        );
    }

}