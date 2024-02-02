package uk.gov.esos.api.workflow.request.flow.common.actionhandler;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;

public interface RequestTaskActionHandler<T extends RequestTaskActionPayload> {

    @Transactional
    void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser appUser, T payload);
    
    List<RequestTaskActionType> getTypes();
}
