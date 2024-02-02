package uk.gov.esos.api.workflow.request.flow.esos.item.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.service.ItemAccountTypeResponseCreationService;
import uk.gov.esos.api.workflow.request.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.transform.OrganisationItemMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemOrganisationResponseCreationService implements ItemAccountTypeResponseCreationService {

    private final OrganisationAccountQueryService organisationAccountQueryService;
    private final UserAuthService userAuthService;
    private final UserRoleTypeService userRoleTypeService;
    private static final OrganisationItemMapper organisationItemMapper = Mappers.getMapper(OrganisationItemMapper.class);


    @Override
    public AccountType getAccountType() {
        return AccountType.ORGANISATION;
    }

    @Override
    public ItemDTOResponse toItemDTOResponse(ItemPage itemPage, AppUser appUser) {
        //get user info from keycloak for the task assignee ids
        Map<String, UserInfoDTO> users = getUserInfoForItemAssignees(appUser, itemPage);
        //get accounts for operator or regulator
        Map<Long, ItemOrganisationAccountDTO> accounts = getAccounts(itemPage);

        List<ItemDTO> itemDTOs = itemPage.getItems().stream().map(item -> {
            String taskAssigneeId = item.getTaskAssigneeId();
            UserInfoDTO taskAssigneeInfo = taskAssigneeId != null ? users.get(taskAssigneeId) : null;
            RoleType taskAssigneeType = taskAssigneeId != null ? userRoleTypeService.getUserRoleTypeByUserId(taskAssigneeId).getRoleType() : null;
            ItemOrganisationAccountDTO account = accounts.get(item.getAccountId());
            return organisationItemMapper.itemToItemOrganisationDTO(item,
                taskAssigneeInfo,
                taskAssigneeType,
                account);
        }).collect(Collectors.toList());

        return ItemDTOResponse.builder()
            .items(itemDTOs)
            .totalItems(itemPage.getTotalItems())
            .build();
    }

    private Map<Long, ItemOrganisationAccountDTO> getAccounts(ItemPage itemPage) {
        List<Long> accountIds = itemPage.getItems()
            .stream().map(Item::getAccountId)
            .collect(Collectors.toList());

        if (CollectionUtils.isEmpty(accountIds))
            return Collections.emptyMap();

        return organisationAccountQueryService.getAccountsByIds(accountIds).stream()
            .map(organisationItemMapper::accountToItemOrganisationAccountDTO)
            .collect(Collectors.toMap(ItemOrganisationAccountDTO::getAccountId, itemDTO -> itemDTO));
    }

    private Map<String, UserInfoDTO> getUserInfoForItemAssignees(AppUser appUser, ItemPage itemPage) {
        Set<String> userIds = itemPage.getItems().stream()
            .map(Item::getTaskAssigneeId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        if (CollectionUtils.isEmpty(userIds))
            return Collections.emptyMap();

        //if the assignee of all items is the appUser
        if (userIds.size() == 1 && userIds.contains(appUser.getUserId()))
            return Map.of(appUser.getUserId(),
                new UserInfoDTO(appUser.getFirstName(), appUser.getLastName()));

        return userAuthService.getUsers(new ArrayList<>(userIds)).stream()
            .collect(Collectors.toMap(
                UserInfo::getId,
                u -> new UserInfoDTO(u.getFirstName(), u.getLastName())));
    }
}
