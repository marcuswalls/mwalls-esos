package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service.NotificationOfComplianceP3ApplyService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3ApplySaveActionHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3ApplySaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NotificationOfComplianceP3ApplyService notificationOfComplianceP3ApplyService;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final AppUser appUser = AppUser.builder().userId("userId").build();
        final NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload taskActionPayload =
                NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(RequestTaskActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD)
                        .build();
        final RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT, appUser, taskActionPayload);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(notificationOfComplianceP3ApplyService, times(1)).applySaveAction(taskActionPayload, requestTask);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT,
                RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT);
    }
}
