package uk.gov.esos.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.OperatorAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemAssignmentType;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemOperatorRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemUnassignedOperatorServiceTest {

    @InjectMocks
    private ItemUnassignedOperatorService service;

    @Mock
    private ItemOperatorRepository itemOperatorRepository;

    @Mock
    private ItemResponseService itemResponseService;

    @Mock
    private OperatorAuthorityResourceAdapter operatorAuthorityResourceAdapter;

    @Test
    void getUnassignedItems() {
        AccountType accountType = AccountType.ORGANISATION;
        Long accountId = 1L;
        AppUser appUser = AppUser.builder()
            .userId("userId")
            .authorities(List.of(AppAuthority.builder().accountId(accountId).build()))
            .roleType(RoleType.OPERATOR)
            .build();
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of(accountId, Set.of(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT));

        Item expectedItem = mock(Item.class);
        ItemPage expectedItemPage = ItemPage.builder()
            .items(List.of(expectedItem))
            .totalItems(1L)
            .build();
        ItemDTO expectedItemDTO = mock(ItemDTO.class);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
            .items(List.of(expectedItemDTO))
            .totalItems(1L)
            .build();
        PagingRequest pagingRequest = PagingRequest.builder().pageNumber(0L).pageSize(5L).build();


        when(operatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType)).thenReturn(scopedRequestTaskTypes);
        when(itemOperatorRepository.findItems(appUser.getUserId(), ItemAssignmentType.UNASSIGNED, scopedRequestTaskTypes, pagingRequest)).thenReturn(expectedItemPage);
        when(itemResponseService.toItemDTOResponse(expectedItemPage, accountType, appUser)).thenReturn(expectedItemDTOResponse);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = service.getUnassignedItems(appUser, accountType, pagingRequest);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);

        verify(operatorAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);
        verify(itemOperatorRepository, times(1))
            .findItems(appUser.getUserId(), ItemAssignmentType.UNASSIGNED, scopedRequestTaskTypes, pagingRequest);
        verify(itemResponseService, times(1))
            .toItemDTOResponse(expectedItemPage, accountType, appUser);
    }

    @Test
    void getUnassignedItems_no_user_scopes() {
        AccountType accountType = AccountType.ORGANISATION;
        AppUser appUser = AppUser.builder()
            .userId("userId")
            .authorities(List.of())
            .roleType(RoleType.OPERATOR)
            .build();

        PagingRequest pagingRequest = PagingRequest.builder().pageNumber(0L).pageSize(5L).build();
        ItemDTOResponse emptyItemDTOResponse = ItemDTOResponse.emptyItemDTOResponse();

        when(operatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType)).thenReturn(Map.of());

        // Invoke
        ItemDTOResponse actualItemDTOResponse = service.getUnassignedItems(appUser, accountType, pagingRequest);

        // Assert
        assertEquals(emptyItemDTOResponse, actualItemDTOResponse);

        verify(operatorAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);
        verifyNoInteractions(itemOperatorRepository, itemResponseService);
    }

    @Test
    void getUnassignedItems_no_items() {
        AccountType accountType = AccountType.ORGANISATION;
        Long accountId = 1L;
        AppUser appUser = AppUser.builder()
            .userId("userId")
            .authorities(List.of(AppAuthority.builder().accountId(accountId).build()))
            .roleType(RoleType.OPERATOR)
            .build();
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of(accountId, Set.of(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT));

        ItemPage expectedItemPage = ItemPage.builder()
            .items(Collections.emptyList())
            .totalItems(0L).build();
        ItemDTOResponse emptyItemDTOResponse = ItemDTOResponse.emptyItemDTOResponse();
        PagingRequest pagingRequest = PagingRequest.builder().pageNumber(0L).pageSize(5L).build();


        when(operatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType)).thenReturn(scopedRequestTaskTypes);
        when(itemOperatorRepository.findItems(appUser.getUserId(), ItemAssignmentType.UNASSIGNED, scopedRequestTaskTypes, pagingRequest)).thenReturn(expectedItemPage);
        when(itemResponseService.toItemDTOResponse(expectedItemPage, accountType, appUser)).thenReturn(emptyItemDTOResponse);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = service.getUnassignedItems(appUser, accountType, pagingRequest);

        // Assert
        assertEquals(emptyItemDTOResponse, actualItemDTOResponse);

        verify(operatorAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);
        verify(itemOperatorRepository, times(1))
            .findItems(appUser.getUserId(), ItemAssignmentType.UNASSIGNED, scopedRequestTaskTypes, pagingRequest);
        verify(itemResponseService, times(1))
            .toItemDTOResponse(expectedItemPage, accountType, appUser);
    }

    @Test
    void getRoleType() {
        assertEquals(RoleType.OPERATOR, service.getRoleType());
    }
}