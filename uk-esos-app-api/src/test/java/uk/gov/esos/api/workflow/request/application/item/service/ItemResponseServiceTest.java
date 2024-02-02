package uk.gov.esos.api.workflow.request.application.item.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemResponseServiceTest {

    @InjectMocks
    private ItemResponseService itemResponseService;

    @Spy
    private ArrayList<ItemAccountTypeResponseCreationService> itemResponseCreationServices;

    @Mock
    private TestItemResponseCreationService itemResponseCreationService;

    @BeforeEach
    void setUp() {
        itemResponseCreationServices.add(itemResponseCreationService);
    }

    @Test
    void toItemDTOResponse() {
        AccountType accountType = AccountType.ORGANISATION;
        Item expectedItem = mock(Item.class);
        ItemPage itemPage = ItemPage.builder()
            .items(List.of(expectedItem))
            .totalItems(1L)
            .build();
        AppUser pmrvUser = AppUser.builder().userId("user").roleType(RoleType.OPERATOR).build();
        ItemDTO itemDTO = Mockito.mock(ItemDTO.class);
        ItemDTOResponse itemDTOResponse = ItemDTOResponse.builder().items(List.of(itemDTO)).totalItems(1L).build();

        when(itemResponseCreationService.getAccountType()).thenReturn(AccountType.ORGANISATION);
        when(itemResponseCreationService.toItemDTOResponse(itemPage, pmrvUser)).thenReturn(itemDTOResponse);

        ItemDTOResponse result = itemResponseService.toItemDTOResponse(itemPage, accountType, pmrvUser);

        assertEquals(itemDTOResponse, result);
    }

    private static class TestItemResponseCreationService implements ItemAccountTypeResponseCreationService {
        @Override
        public ItemDTOResponse toItemDTOResponse(ItemPage itemPage, AppUser appUser) {
            return null;
        }

        @Override
        public AccountType getAccountType() {
            return null;
        }
    }
}
