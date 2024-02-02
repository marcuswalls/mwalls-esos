package uk.gov.esos.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.application.authorization.RegulatorAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemAssignmentType;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemRegulatorRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemAssignedToMeRegulatorService implements ItemAssignedToMeService {

    private final ItemRegulatorRepository itemRegulatorRepository;
    private final ItemResponseService itemResponseService;
    private final RegulatorAuthorityResourceAdapter regulatorAuthorityResourceAdapter;

    @Override
    public ItemDTOResponse getItemsAssignedToMe(AppUser pmrvUser, AccountType accountType, PagingRequest paging) {
        Map<CompetentAuthorityEnum, Set<RequestTaskType>> userScopedRequestTaskTypes = regulatorAuthorityResourceAdapter
                .getUserScopedRequestTaskTypesByAccountType(pmrvUser.getUserId(), accountType);

        ItemPage itemPage = itemRegulatorRepository.findItems(
                pmrvUser.getUserId(),
                ItemAssignmentType.ME,
                userScopedRequestTaskTypes,
                paging);

        return itemResponseService.toItemDTOResponse(itemPage, accountType, pmrvUser);
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.REGULATOR;
    }
}
