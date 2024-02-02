package uk.gov.esos.api.workflow.request.flow.common.taskhandler;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskCreateService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@ExtendWith(MockitoExtension.class)
class DefaultUserTaskCreatedHandlerTest {

	@InjectMocks
    private DefaultUserTaskCreatedHandler cut;

    @Mock
    private RequestTaskCreateService requestTaskCreateService;
    
    @Test
    void createRequestTask_dynamic_default_request_type() {
    	String requestId = "1";
    	String processTaskId = "proc";
    	DynamicUserTaskDefinitionKey taskDefinitionKey = DynamicUserTaskDefinitionKey.APPLICATION_REVIEW;
    	Map<String, Object> variables = Map.of(
    			BpmnProcessConstants.REQUEST_TYPE, RequestType.ORGANISATION_ACCOUNT_OPENING.name()
    			);
    	
    	cut.createRequestTask(requestId, processTaskId, taskDefinitionKey.name(), variables);
    	
    	verify(requestTaskCreateService, times(1)).create(requestId, processTaskId, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    }
    
    @Test
    void createRequestTask_fixed_request_task_type() {
    	String requestId = "1";
    	String processTaskId = "proc";
    	String taskDefinitionKey = RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name();
    	Map<String, Object> variables = Map.of(
    			BpmnProcessConstants.REQUEST_TYPE, RequestType.ORGANISATION_ACCOUNT_OPENING.name()
    			);
    	
    	cut.createRequestTask(requestId, processTaskId, taskDefinitionKey, variables);
    	
    	verify(requestTaskCreateService, times(1)).create(requestId, processTaskId, RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    }
}
