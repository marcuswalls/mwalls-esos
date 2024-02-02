package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper.NotificationOfComplianceP3Mapper;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3ReturnToSubmitService {

    private final RequestService requestService;
    private static final NotificationOfComplianceP3Mapper NOTIFICATION_OF_COMPLIANCE_P3_MAPPER = Mappers.getMapper(NotificationOfComplianceP3Mapper.class);

    @Transactional
    public void applyReturnToSubmitAction(RequestTask requestTask) {
        Request request = requestTask.getRequest();
        NotificationOfComplianceP3RequestPayload requestPayload = (NotificationOfComplianceP3RequestPayload) request.getPayload();
        NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload =
            (NotificationOfComplianceP3ApplicationRequestTaskPayload) requestTask.getPayload();

        requestPayload.setNoc(taskPayload.getNoc());
        requestPayload.setNocSectionsCompleted(taskPayload.getNocSectionsCompleted());
        requestPayload.setNocAttachments(taskPayload.getNocAttachments());

        addRequestAction(taskPayload, request, RequestActionType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT, requestPayload.getSupportingOperator());
    }

    private void addRequestAction(NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload,
                                  Request request,
                                  RequestActionType requestActionType,
                                  String submittedBy) {

        NotificationOfComplianceP3ApplicationRequestActionPayload notificationOfComplianceP3ApplicationRequestActionPayload =
            NOTIFICATION_OF_COMPLIANCE_P3_MAPPER.toNotificationOfComplianceP3ApplicationRequestActionPayload(taskPayload,
                RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT_PAYLOAD);
        requestService.addActionToRequest(request, notificationOfComplianceP3ApplicationRequestActionPayload, requestActionType, submittedBy);
    }
}
