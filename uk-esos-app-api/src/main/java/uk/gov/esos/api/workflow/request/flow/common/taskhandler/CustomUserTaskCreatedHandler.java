package uk.gov.esos.api.workflow.request.flow.common.taskhandler;

public interface CustomUserTaskCreatedHandler extends UserTaskCreatedHandler {

	String getTaskDefinitionKey();
	
}
