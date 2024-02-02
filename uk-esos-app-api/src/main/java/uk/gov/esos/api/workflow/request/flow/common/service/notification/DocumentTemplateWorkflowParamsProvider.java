package uk.gov.esos.api.workflow.request.flow.common.service.notification;

import java.util.Map;

import uk.gov.esos.api.workflow.request.core.domain.Payload;

public interface DocumentTemplateWorkflowParamsProvider<T extends Payload> {

    DocumentTemplateGenerationContextActionType getContextActionType();
    
    Map<String, Object> constructParams(T payload);
    
}
