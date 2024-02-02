package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.NocOutcome;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service.NotificationOfComplianceP3SubmitService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplicationSubmitActionHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplicationSubmitActionHandler submitActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NotificationOfComplianceP3SubmitService nocSubmitService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        String requestId = "id";
        RequestTask requestTask = RequestTask.builder()
            .request(Request.builder().id(requestId).build())
            .processTaskId(processTaskId)
            .build();
        AppUser user = AppUser.builder().build();
        RequestTaskActionEmptyPayload payload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadType.EMPTY_PAYLOAD)
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        submitActionHandler.process(requestTaskId,
            RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION,
            user,
            payload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(nocSubmitService, times(1)).submitNocAction(requestTask);
        verify(workflowService, times(1)).completeTask(processTaskId,
            Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                BpmnProcessConstants.NOC_OUTCOME, NocOutcome.SUBMIT));
    }

    @Test
    void getTypes() {
        assertThat(submitActionHandler.getTypes())
            .containsOnly(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION);
    }
}