package uk.gov.esos.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.application.authorization.OperatorAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemByRequestOperatorRepository;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemOperatorRepository;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemOperatorService implements ItemService {

    private final OperatorAuthorityResourceAdapter operatorAuthorityResourceAdapter;
    private final ItemResponseService itemResponseService;
    private final ItemByRequestOperatorRepository itemByRequestOperatorRepository;
    private final RequestService requestService;

    @Override
    public ItemDTOResponse getItemsByRequest(AppUser pmrvUser, String requestId) {
        Request request = requestService.findRequestById(requestId);
        Long accountId = request.getAccountId();
        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypes = operatorAuthorityResourceAdapter
                .getUserScopedRequestTaskTypesByAccountId(pmrvUser.getUserId(), accountId);

        if (ObjectUtils.isEmpty(userScopedRequestTaskTypes)) {
            return ItemDTOResponse.emptyItemDTOResponse();
        }

        ItemPage itemPage = itemByRequestOperatorRepository.findItemsByRequestId(userScopedRequestTaskTypes, requestId);

        return itemResponseService.toItemDTOResponse(itemPage, request.getType().getAccountType(), pmrvUser);
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.OPERATOR;
    }
}
