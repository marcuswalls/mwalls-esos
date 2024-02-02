package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper.NotificationOfComplianceP3Mapper;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3SendToEditService {

    private final RequestService requestService;
    private final NotificationOfComplianceP3Mapper notificationOfComplianceP3Mapper;

    @Transactional
    public void applySendToEditAction(RequestTask requestTask, String selectedAssignee, AppUser appUser) {
        Request request = requestTask.getRequest();
        NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload nocSubmitRequestTaskPayload =
                (NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        NotificationOfComplianceP3RequestPayload nocRequestPayload = (NotificationOfComplianceP3RequestPayload) request.getPayload();

        nocRequestPayload.setSupportingOperator(selectedAssignee);
        nocRequestPayload.setNoc(nocSubmitRequestTaskPayload.getNoc());
        nocRequestPayload.setNocSectionsCompleted(nocSubmitRequestTaskPayload.getNocSectionsCompleted());
        nocRequestPayload.setNocAttachments(nocSubmitRequestTaskPayload.getNocAttachments());
        nocRequestPayload.setAccountOriginatedData(nocSubmitRequestTaskPayload.getAccountOriginatedData());

        addApplicationSubmittedRequestAction(nocSubmitRequestTaskPayload, request, RequestActionType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT, appUser.getUserId());
    }

    private void addApplicationSubmittedRequestAction(NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload notificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
                                                      Request request,
                                                      RequestActionType requestActionType,
                                                      String appUser) {

        NotificationOfComplianceP3ApplicationRequestActionPayload notificationOfComplianceP3ApplicationSubmittedPayload =
                notificationOfComplianceP3Mapper.toNotificationOfComplianceP3ApplicationRequestActionPayload(
                        notificationOfComplianceP3ApplicationSubmitRequestTaskPayload, RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT_PAYLOAD);

        requestService.addActionToRequest(request, notificationOfComplianceP3ApplicationSubmittedPayload, requestActionType, appUser);
    }
}
