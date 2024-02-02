package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplyServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplyService service;

    @Test
    void applySaveAction() {
        final Map<String, String> nocSectionsCompleted = Map.of("key", "completed");
        final NocP3 noc = NocP3.builder()
                .responsibleUndertaking(ResponsibleUndertaking.builder()
                        .organisationDetails(ReviewOrganisationDetails.builder()
                                .name("Organisation name")
                                .build())
                        .build())
                .build();
        final NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload taskActionPayload =
                NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .noc(noc)
                        .nocSectionsCompleted(nocSectionsCompleted)
                        .build();
        RequestTask requestTask = RequestTask.builder()
                .type(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
                .payload(NotificationOfComplianceP3ApplicationRequestTaskPayload.builder()
                        .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                        .build())
                .build();

        // Invoke
        service.applySaveAction(taskActionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(NotificationOfComplianceP3ApplicationRequestTaskPayload.class);
        assertThat(((NotificationOfComplianceP3ApplicationRequestTaskPayload) requestTask.getPayload()).getNocSectionsCompleted())
                .isEqualTo(nocSectionsCompleted);
        assertThat(((NotificationOfComplianceP3ApplicationRequestTaskPayload) requestTask.getPayload()).getNoc())
                .isEqualTo(noc);
    }
}
