package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.handler;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.domain.NotificationOfComplianceP3ApplicationEditRequestTaskPayload;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3ApplicationEditInitializerRequestTaskHandler implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final NotificationOfComplianceP3RequestPayload requestPayload =
                (NotificationOfComplianceP3RequestPayload) request.getPayload();

        return NotificationOfComplianceP3ApplicationEditRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT_PAYLOAD)
                .accountOriginatedData(requestPayload.getAccountOriginatedData())
                .noc(requestPayload.getNoc())
                .nocSectionsCompleted(requestPayload.getNocSectionsCompleted())
                .nocAttachments(requestPayload.getNocAttachments())
                .build();
    }

    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT);
    }
}
