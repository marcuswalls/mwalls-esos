package uk.gov.esos.api.workflow.request.application.authorization;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.account.service.AccountQueryService;
import uk.gov.esos.api.authorization.rules.services.resource.OperatorAuthorityResourceService;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OperatorAuthorityResourceAdapterTest {

    @InjectMocks
    private OperatorAuthorityResourceAdapter operatorAuthorityResourceAdapter;

    @Mock
    private OperatorAuthorityResourceService operatorAuthorityResourceService;

    @Mock
    private AccountQueryService accountQueryService;

    @Test
    void getUserScopedRequestTaskTypesByAccountId() {
        final String userId = "userId";
        final Long accountId = 1L;

        when(operatorAuthorityResourceService.findUserScopedRequestTaskTypesByAccounts(userId, Set.of(accountId)))
            .thenReturn(Map.of(
                accountId, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name(), RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT.name()))
            );

        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypesByAccounts =
            operatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountId(userId, accountId);

        assertThat(userScopedRequestTaskTypesByAccounts).containsExactlyEntriesOf(Map.of(
            accountId,
            Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT))
        );

        verify(operatorAuthorityResourceService, times(1))
            .findUserScopedRequestTaskTypesByAccounts(userId, Set.of(accountId));
        verifyNoInteractions(accountQueryService);
    }

    @Test
    void getUserScopedRequestTaskTypesByAccountType() {
        final Long accountId1 = 1L;
        final Long accountId2 = 2L;
        final List<Long> accounts = List.of(accountId1, accountId2);
        final String userId = "userId";
        final AppUser pmrvUser = AppUser.builder()
            .userId(userId)
            .authorities(List.of(
                AppAuthority.builder().accountId(accountId1).build(),
                AppAuthority.builder().accountId(accountId2).build()
                )
            )
            .build();
        final AccountType accountType = AccountType.ORGANISATION;
        final Set<Long> installationAccounts = Set.of(accountId1, accountId2);

        when(accountQueryService.getAccountIdsByAccountType(accounts, accountType)).thenReturn(installationAccounts);
        when(operatorAuthorityResourceService.findUserScopedRequestTaskTypesByAccounts(userId, installationAccounts))
            .thenReturn(Map.of(
                accountId1, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name())
                )
            );

        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypesByAccountType =
            operatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(pmrvUser, accountType);

        assertThat(userScopedRequestTaskTypesByAccountType).containsExactlyEntriesOf(
            Map.of(accountId1, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW))
        );

        verify(accountQueryService, times(1)).getAccountIdsByAccountType(accounts, accountType);
        verify(operatorAuthorityResourceService, times(1))
            .findUserScopedRequestTaskTypesByAccounts(userId, installationAccounts);
    }
}