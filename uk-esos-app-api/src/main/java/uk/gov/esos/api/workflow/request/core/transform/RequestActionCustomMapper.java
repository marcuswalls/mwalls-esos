package uk.gov.esos.api.workflow.request.core.transform;

import java.util.Set;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.core.domain.RequestAction;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;

public interface RequestActionCustomMapper {

    RequestActionDTO toRequestActionDTO(RequestAction requestAction);

    RequestActionType getRequestActionType();

    Set<RoleType> getUserRoleTypes();
}
