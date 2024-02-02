package uk.gov.esos.api.workflow.request.flow.esos.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemAssigneeDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationAccountDTO;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemOrganisationResponseCreationServiceTest {

    @InjectMocks
    private ItemOrganisationResponseCreationService service;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private UserRoleTypeService userRoleTypeService;

    @Mock
    private OrganisationAccountQueryService organisationAccountQueryService;

    @Test
    void getAccountType() {
        assertEquals(AccountType.ORGANISATION, service.getAccountType());
    }

    @Test
    void toItemDTOResponse_same_assignee() {
        String userId = "operatorUserId";
        RoleType userRoleType = RoleType.OPERATOR;
        Long accountId = 1L;
        AppUser operatorUser = AppUser.builder()
            .userId(userId)
            .firstName("firstName")
            .lastName("lastName")
            .authorities(List.of(AppAuthority.builder().accountId(accountId).build()))
            .roleType(RoleType.OPERATOR)
            .build();
        OrganisationAccountDTO accountDTO = OrganisationAccountDTO.builder()
            .id(accountId)
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .organisationId(String.valueOf(accountId))
            .registrationNumber("regNbr")
            .build();

        Item item = buildItem(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, userId, accountId);

        ItemPage itemPage = ItemPage.builder()
            .items(List.of(item))
            .totalItems(1L)
            .build();

        ItemOrganisationDTO expectedItemDTO = buildItemDTO(
            item,
            UserInfoDTO.builder()
                .firstName("firstName")
                .lastName("lastName")
                .build(),
            userRoleType);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
            .items(List.of(expectedItemDTO))
            .totalItems(1L)
            .build();

        // Mock
        when(organisationAccountQueryService.getAccountsByIds(List.of(accountId)))
            .thenReturn(List.of(accountDTO));
        when(userRoleTypeService.getUserRoleTypeByUserId(userId))
            .thenReturn(UserRoleTypeDTO.builder().roleType(userRoleType).build());

        // Invoke
        ItemDTOResponse actualItemDTOResponse = service.toItemDTOResponse(itemPage, operatorUser);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(userId);
        verify(userAuthService, never()).getUsers(anyList());
        verify(organisationAccountQueryService, times(1)).getAccountsByIds(List.of(accountId));
    }

    @Test
    void toItemDTOResponse_different_assignee() {
        Long accountId = 1L;
        AppUser user = AppUser.builder()
            .userId("userId")
            .firstName("fname")
            .lastName("lname")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
            .roleType(RoleType.REGULATOR)
            .build();
        OrganisationAccountDTO accountDTO = OrganisationAccountDTO.builder()
            .id(accountId)
            .name("accountName")
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .organisationId(String.valueOf(accountId))
            .registrationNumber("regNbr")
            .build();
        Item item = buildItem(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, "userId2", accountId);
        ItemPage itemPage = ItemPage.builder()
            .items(List.of(item))
            .totalItems(1L)
            .build();

        ItemOrganisationDTO expectedItemDTO = buildItemDTO(
            item,
            UserInfoDTO.builder()
                .firstName("fname2")
                .lastName("lname2")
                .build(),
            RoleType.REGULATOR);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
            .items(List.of(expectedItemDTO))
            .totalItems(1L)
            .build();

        // Mock
        when(userAuthService.getUsers(List.of(item.getTaskAssigneeId())))
            .thenReturn(List.of(UserInfo.builder().id("userId2").firstName("fname2").lastName("lname2").build()));

        when(organisationAccountQueryService.getAccountsByIds(List.of(item.getAccountId())))
            .thenReturn(List.of(accountDTO));

        when(userRoleTypeService.getUserRoleTypeByUserId("userId2"))
            .thenReturn(UserRoleTypeDTO.builder().roleType(RoleType.REGULATOR).build());

        // Invoke
        ItemDTOResponse actualItemDTOResponse = service.toItemDTOResponse(itemPage, user);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId("userId2");
        verify(userAuthService, times(1)).getUsers(List.of(item.getTaskAssigneeId()));
        verify(organisationAccountQueryService, times(1))
            .getAccountsByIds(List.of(item.getAccountId()));
    }

    private Item buildItem(RequestTaskType taskType, String assigneeId, Long accountId) {
        return Item.builder()
            .creationDate(LocalDateTime.now())
            .requestId("1")
            .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
            .taskId(1L)
            .taskType(taskType)
            .taskAssigneeId(assigneeId)
            .taskDueDate(LocalDate.of(2021, 1, 1))
            .accountId(accountId)
            .build();
    }

    private ItemOrganisationDTO buildItemDTO(Item item, UserInfoDTO taskAssignee, RoleType roleType) {
        return ItemOrganisationDTO.builder()
            .creationDate(item.getCreationDate())
            .requestId(item.getRequestId())
            .requestType(item.getRequestType())
            .taskId(item.getTaskId())
            .taskType(item.getTaskType())
            .itemAssignee(taskAssignee != null ?
                ItemAssigneeDTO.builder()
                    .taskAssignee(taskAssignee)
                    .taskAssigneeType(roleType)
                    .build() : null)
            .daysRemaining(DAYS.between(LocalDate.now(), item.getTaskDueDate()))
            .account(ItemOrganisationAccountDTO.builder()
                .accountId(item.getAccountId())
                .accountName("accountName")
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .accountOrganisationId(String.valueOf(item.getAccountId()))
                .accountRegistrationNumber("regNbr")
                .build())
            .build();
    }
}