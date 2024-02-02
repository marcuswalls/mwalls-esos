package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.mapper.NotificationOfComplianceP3Mapper;

@Service
@RequiredArgsConstructor
public class NotificationOfComplianceP3AddSubmittedRequestActionService {

    private final RequestService requestService;
    private static final NotificationOfComplianceP3Mapper NOTIFICATION_OF_COMPLIANCE_P3_MAPPER = Mappers.getMapper(NotificationOfComplianceP3Mapper.class);

    public void addRequestAction(String requestId) {
        Request request = requestService.findRequestById(requestId);
        NotificationOfComplianceP3RequestPayload requestPayload = (NotificationOfComplianceP3RequestPayload) request.getPayload();

        NotificationOfComplianceP3ApplicationRequestActionPayload requestActionPayload =
            NOTIFICATION_OF_COMPLIANCE_P3_MAPPER
                .toNotificationOfComplianceP3ApplicationRequestActionPayload(
                    requestPayload,
                    RequestActionPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED_PAYLOAD
                );

        requestService.addActionToRequest(
            request,
            requestActionPayload,
            RequestActionType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED,
            requestPayload.getOperatorAssignee()
        );
    }
}
