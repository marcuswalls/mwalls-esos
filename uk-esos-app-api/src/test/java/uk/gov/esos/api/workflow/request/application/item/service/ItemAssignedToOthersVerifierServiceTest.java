package uk.gov.esos.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.VerifierAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemAssignmentType;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemVerifierRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

@ExtendWith(MockitoExtension.class)
class ItemAssignedToOthersVerifierServiceTest {

    @InjectMocks
    private ItemAssignedToOthersVerifierService itemService;

    @Mock
    private ItemResponseService itemResponseService;

    @Mock
    private ItemVerifierRepository itemRepository;

    @Mock
    private VerifierAuthorityResourceAdapter verifierAuthorityResourceAdapter;

    @Test
    void getItemsAssignedToOthers() {
        final AccountType accountType = AccountType.ORGANISATION;
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of(1L, Set.of(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));

        AppUser appUser = AppUser.builder().userId("vb1Id").roleType(RoleType.VERIFIER).build();
        Item expectedItem = mock(Item.class);
        ItemPage expectedItemPage = ItemPage.builder()
                .items(List.of(expectedItem))
                .totalItems(1L).build();
        ItemDTO expectedItemDTO = mock(ItemDTO.class);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L).build();

        // Mock
        when(verifierAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType))
                .thenReturn(scopedRequestTaskTypes);
        doReturn(expectedItemPage).when(itemRepository).findItems(appUser.getUserId(), ItemAssignmentType.OTHERS,
                scopedRequestTaskTypes, PagingRequest.builder().pageNumber(0L).pageSize(10L).build());
        doReturn(expectedItemDTOResponse).when(itemResponseService).toItemDTOResponse(expectedItemPage, accountType, appUser);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsAssignedToOthers(appUser, accountType, PagingRequest.builder().pageNumber(0L).pageSize(10L).build());

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verify(verifierAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);
    }

    @Test
    void getItemsAssignedToOthers_empty_scopes() {
        final AccountType accountType = AccountType.ORGANISATION;
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of();
        AppUser appUser = AppUser.builder().userId("vb1Id").roleType(RoleType.VERIFIER).build();

        // Mock
        when(verifierAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(appUser, accountType))
                .thenReturn(scopedRequestTaskTypes);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsAssignedToOthers(appUser, accountType,PagingRequest.builder().pageNumber(0L).pageSize(10L).build());

        // Assert
        assertThat(actualItemDTOResponse).isEqualTo(ItemDTOResponse.emptyItemDTOResponse());

        verify(verifierAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);
        verify(itemRepository, never()).findItems(anyString(), Mockito.any(), anyMap(), any(PagingRequest.class));
        verify(itemResponseService, never()).toItemDTOResponse(any(), any(), any());
    }

    @Test
    void getRoleType() {
        assertEquals(RoleType.VERIFIER, itemService.getRoleType());
    }
}
