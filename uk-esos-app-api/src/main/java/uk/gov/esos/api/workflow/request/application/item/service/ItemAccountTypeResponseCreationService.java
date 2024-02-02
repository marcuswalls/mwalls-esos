package uk.gov.esos.api.workflow.request.application.item.service;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

public interface ItemAccountTypeResponseCreationService {

    ItemDTOResponse toItemDTOResponse(ItemPage itemPage, AppUser appUser);

    AccountType getAccountType();
}
