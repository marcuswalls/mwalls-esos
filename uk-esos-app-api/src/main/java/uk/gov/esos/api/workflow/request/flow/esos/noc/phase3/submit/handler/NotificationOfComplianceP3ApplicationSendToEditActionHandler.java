package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.validation.SupportingTaskAssignmentValidator;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.NocOutcome;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.SendToEditRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service.NotificationOfComplianceP3SendToEditService;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NotificationOfComplianceP3ApplicationSendToEditActionHandler
    implements RequestTaskActionHandler<SendToEditRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final SupportingTaskAssignmentValidator supportingTaskAssignmentValidator;
    private final NotificationOfComplianceP3SendToEditService nocP3SendToEditService;
    private final WorkflowService workflowService;

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser,
                        SendToEditRequestTaskActionPayload taskActionPayload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        String supportingOperator = taskActionPayload.getSupportingOperator();

        supportingTaskAssignmentValidator.validate(requestTask, RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT, supportingOperator, appUser);

        nocP3SendToEditService.applySendToEditAction(requestTask, supportingOperator, appUser);

        workflowService.completeTask(
            requestTask.getProcessTaskId(),
            Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                BpmnProcessConstants.NOC_OUTCOME, NocOutcome.SEND_TO_EDIT)
        );
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT);
    }
}
