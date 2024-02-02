package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.handler;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service.NotificationOfComplianceP3ApplyService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class NotificationOfComplianceP3ApplySaveActionHandler implements RequestTaskActionHandler<NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final NotificationOfComplianceP3ApplyService notificationOfComplianceP3ApplyService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        notificationOfComplianceP3ApplyService.applySaveAction(payload, requestTask);
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(
                RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT,
                RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT
        );
    }
}
