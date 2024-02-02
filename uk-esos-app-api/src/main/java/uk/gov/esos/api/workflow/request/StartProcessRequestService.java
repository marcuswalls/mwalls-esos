package uk.gov.esos.api.workflow.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestCreateService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestIdGeneratorResolver;

import java.util.HashMap;
import java.util.Map;

import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus.IN_PROGRESS;

/**
 * Handler for starting a workflow process.
 */
@Component
@Log4j2
@RequiredArgsConstructor
public class StartProcessRequestService {

    private final WorkflowService workflowService;
    private final RequestCreateService requestCreateService;
    private final RequestIdGeneratorResolver requestIdGeneratorResolver;

    public Request startProcess(RequestParams params) {
        String requestId = generateRequestId(params);

        Request request = createRequest(params.withRequestId(requestId));

        Map<String, Object> processVars = new HashMap<>();
        processVars.put(BpmnProcessConstants.REQUEST_ID, request.getId());
        processVars.put(BpmnProcessConstants.REQUEST_TYPE, request.getType().name());
        processVars.putAll(params.getProcessVars());

        String processInstanceId = startProcessDefinition(request, processVars);

        setProcessToRequest(processInstanceId, request);

        return request;
    }

    public void reStartProcess(Request request) {
        Map<String, Object> processVars = new HashMap<>();
        processVars.put(BpmnProcessConstants.REQUEST_ID, request.getId());
        processVars.put(BpmnProcessConstants.REQUEST_TYPE, request.getType().name());

        request.setStatus(IN_PROGRESS);
        String processInstanceId = startProcessDefinition(request, processVars);

        setProcessToRequest(processInstanceId, request);
    }

    private Request createRequest(RequestParams params) {
        return requestCreateService.createRequest(params, IN_PROGRESS);
    }

    private String startProcessDefinition(Request request, Map<String, Object> vars) {
        String processDefinitionId = request.getType().getProcessDefinitionId();
        String processInstanceId = workflowService.startProcessDefinition(processDefinitionId, vars);
        log.info("Triggered {} process flow with id: {}", request.getType()::name, () -> processInstanceId);
        return processInstanceId;
    }

    private void setProcessToRequest(String processInstanceId, Request request) {
        request.setProcessInstanceId(processInstanceId);
    }

    private String generateRequestId(RequestParams params) {
        return requestIdGeneratorResolver.get(params.getType()).generate(params);
    }
}
