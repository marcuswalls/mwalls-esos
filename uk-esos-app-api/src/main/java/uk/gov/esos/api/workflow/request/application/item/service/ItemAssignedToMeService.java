package uk.gov.esos.api.workflow.request.application.item.service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

public interface ItemAssignedToMeService {

    ItemDTOResponse getItemsAssignedToMe(AppUser pmrvUser, AccountType accountType, PagingRequest paging);

    RoleType getRoleType();
}
