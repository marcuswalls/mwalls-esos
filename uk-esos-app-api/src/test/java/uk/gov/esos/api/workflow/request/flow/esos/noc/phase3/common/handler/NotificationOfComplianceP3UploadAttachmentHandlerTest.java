package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.handler.NotificationOfComplianceP3UploadAttachmentHandler;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service.NotificationOfComplianceP3UploadAttachmentService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3UploadAttachmentHandlerTest {

    @InjectMocks
    private NotificationOfComplianceP3UploadAttachmentHandler handler;

    @Mock
    private NotificationOfComplianceP3UploadAttachmentService attachmentService;

    @Test
    void uploadAttachment() {
        final Long requestTaskId = 1L;
        final String filename = "filename";
        final String attachmentUuid = UUID.randomUUID().toString();

        // Invoke
        handler.uploadAttachment(requestTaskId, attachmentUuid, filename);

        // Verify
        verify(attachmentService, times(1)).uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Test
    void getTypes() {
        assertThat(handler.getType()).isEqualTo(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT);
    }
}
