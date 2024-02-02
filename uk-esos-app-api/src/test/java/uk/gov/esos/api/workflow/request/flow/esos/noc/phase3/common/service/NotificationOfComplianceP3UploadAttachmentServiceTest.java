package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service.NotificationOfComplianceP3UploadAttachmentService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3UploadAttachmentServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3UploadAttachmentService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void uploadAttachment() {

        final Long requestTaskId = 1L;
        final String fileName = "name";
        final RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .payload(NotificationOfComplianceP3ApplicationRequestTaskPayload.builder().build())
                .build();
        final String attachmentUuid = UUID.randomUUID().toString();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        service.uploadAttachment(requestTaskId, attachmentUuid, fileName);

        // Verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        assertThat(requestTask.getPayload().getAttachments()).containsEntry(UUID.fromString(attachmentUuid), fileName);
    }
}
