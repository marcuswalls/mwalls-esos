package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3UploadAttachmentService {

    private final RequestTaskService requestTaskService;

    @Transactional
    public void uploadAttachment(final Long requestTaskId,
                                 final String attachmentUuid,
                                 final String filename) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final NotificationOfComplianceP3ApplicationRequestTaskPayload requestTaskPayload =
                (NotificationOfComplianceP3ApplicationRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.getAttachments().put(UUID.fromString(attachmentUuid), filename);
    }
}
