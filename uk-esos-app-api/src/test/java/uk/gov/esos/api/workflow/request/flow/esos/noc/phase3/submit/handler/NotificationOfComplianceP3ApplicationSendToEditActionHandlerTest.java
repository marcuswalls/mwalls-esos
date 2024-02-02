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
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.validation.SupportingTaskAssignmentValidator;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.NocOutcome;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.SendToEditRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service.NotificationOfComplianceP3SendToEditService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplicationSendToEditActionHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplicationSendToEditActionHandler sendToEditActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private SupportingTaskAssignmentValidator supportingTaskAssignmentValidator;

    @Mock
    private NotificationOfComplianceP3SendToEditService nocP3SendToEditService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTaskActionType taskActionType = RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT;
        AppUser appUser = AppUser.builder().build();
        String supportingOperator = "supportingOperator";
        SendToEditRequestTaskActionPayload taskActionPayload = SendToEditRequestTaskActionPayload.builder()
            .supportingOperator(supportingOperator)
            .build();

        String processTaskId = "processTaskId";
        String requestId = "req-id";
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .processTaskId(processTaskId)
            .request(Request.builder().id(requestId).build())
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        sendToEditActionHandler.process(requestTaskId, taskActionType, appUser, taskActionPayload);

        //verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(supportingTaskAssignmentValidator, times(1))
            .validate(requestTask, RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT, supportingOperator, appUser);
        verify(nocP3SendToEditService, times(1)).applySendToEditAction(requestTask, supportingOperator, appUser);
        verify(workflowService, times(1)).completeTask(processTaskId,
            Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                BpmnProcessConstants.NOC_OUTCOME, NocOutcome.SEND_TO_EDIT));
    }

    @Test
    void getTypes() {
        assertThat(sendToEditActionHandler.getTypes()).containsOnly(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT);
    }
}