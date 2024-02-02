package uk.gov.esos.api.web.controller.account.organisation;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.gov.esos.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.esos.api.account.domain.dto.AccountSearchResults;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountSearchResultsInfoDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.PagingRequest;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrganisationAccountControllerTest {

    @Mock
    OrganisationAccountQueryService organisationAccountQueryService;

    @InjectMocks
    OrganisationAccountController controller;

    @Test
    void getCurrentUserOrganisationAccounts(){
        AppUser mockUser = Mockito.mock(AppUser.class);
        AccountSearchResults<OrganisationAccountSearchResultsInfoDTO> expectedResults = new AccountSearchResults<>(new ArrayList<>(), 10);

        when(this.organisationAccountQueryService.getAccountsByUserAndSearchCriteria(any(AppUser.class), any(AccountSearchCriteria.class)))
                .thenReturn(expectedResults);

        ResponseEntity<AccountSearchResults> results = this.controller.getCurrentUserOrganisationAccounts(mockUser, "AAA", 0L, 10L);
        Assertions.assertNotNull(results);
        Assertions.assertEquals(HttpStatus.OK, results.getStatusCode());
        Assertions.assertEquals(expectedResults, results.getBody());

        verify(this.organisationAccountQueryService).getAccountsByUserAndSearchCriteria(any(),any());
    }

}
