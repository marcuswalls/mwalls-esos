package uk.gov.esos.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.VerifierAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemAssignmentType;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemVerifierRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemAssignedToMeVerifierService implements ItemAssignedToMeService {

    private final ItemVerifierRepository itemVerifierRepository;
    private final ItemResponseService itemResponseService;
    private final VerifierAuthorityResourceAdapter verifierAuthorityResourceAdapter;

    @Override
    public ItemDTOResponse getItemsAssignedToMe(AppUser appUser, AccountType accountType, PagingRequest paging) {
        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypes =
                verifierAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType);

        ItemPage itemPage = itemVerifierRepository.findItems(
                appUser.getUserId(),
                ItemAssignmentType.ME,
                userScopedRequestTaskTypes,
                paging);

        return itemResponseService.toItemDTOResponse(itemPage, accountType, appUser);
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.VERIFIER;
    }
}
