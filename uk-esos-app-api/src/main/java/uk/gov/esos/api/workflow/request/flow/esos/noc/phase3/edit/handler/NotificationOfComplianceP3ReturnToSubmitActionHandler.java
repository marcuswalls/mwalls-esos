package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.edit.service.NotificationOfComplianceP3ReturnToSubmitService;

import java.util.List;

@RequiredArgsConstructor
@Component
public class NotificationOfComplianceP3ReturnToSubmitActionHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final NotificationOfComplianceP3ReturnToSubmitService notificationOfComplianceP3ReturnToSubmitService;
    private final WorkflowService workflowService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser, RequestTaskActionEmptyPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        notificationOfComplianceP3ReturnToSubmitService.applyReturnToSubmitAction(requestTask);

        // Complete task
        workflowService.completeTask(requestTask.getProcessTaskId());
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT);
    }
}
