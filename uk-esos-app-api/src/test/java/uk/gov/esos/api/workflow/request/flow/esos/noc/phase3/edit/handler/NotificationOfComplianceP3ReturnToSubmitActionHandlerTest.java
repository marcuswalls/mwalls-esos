package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.service.NotificationOfComplianceP3ReturnToSubmitService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ReturnToSubmitActionHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ReturnToSubmitActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NotificationOfComplianceP3ReturnToSubmitService notificationOfComplianceP3ReturnToSubmitService;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final RequestTaskActionType taskActionType = RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT;
        final AppUser appUser = AppUser.builder().build();
        final RequestTaskActionEmptyPayload taskActionPayload = RequestTaskActionEmptyPayload.builder().build();

        String processTaskId = "processTaskId";
        RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .processTaskId(processTaskId)
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, taskActionType, appUser, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(notificationOfComplianceP3ReturnToSubmitService, times(1)).applyReturnToSubmitAction(requestTask);
        verify(workflowService, times(1)).completeTask(processTaskId);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT);
    }
}
