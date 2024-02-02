package uk.gov.esos.api.workflow.request.application.item.service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

public interface ItemService {

    ItemDTOResponse getItemsByRequest(AppUser pmrvUser, String requestId);

    RoleType getRoleType();
}
