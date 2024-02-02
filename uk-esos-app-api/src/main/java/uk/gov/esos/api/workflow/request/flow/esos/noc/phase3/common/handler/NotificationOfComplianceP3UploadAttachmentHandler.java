package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.handler;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskUploadAttachmentActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service.NotificationOfComplianceP3UploadAttachmentService;

@Component
@RequiredArgsConstructor
public class NotificationOfComplianceP3UploadAttachmentHandler extends RequestTaskUploadAttachmentActionHandler {

    private final NotificationOfComplianceP3UploadAttachmentService uploadAttachmentService;

    @Override
    public void uploadAttachment(Long requestTaskId, String attachmentUuid, String filename) {
        uploadAttachmentService.uploadAttachment(requestTaskId, attachmentUuid, filename);
    }

    @Override
    public RequestTaskActionType getType() {
        return RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT;
    }
}
