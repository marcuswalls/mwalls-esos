package uk.gov.esos.api.workflow.request.application.authorization;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.Permission;
import uk.gov.esos.api.authorization.rules.services.resource.VerifierAuthorityResourceService;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.repository.RequestTaskRepository;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT;

@ExtendWith(MockitoExtension.class)
class VerifierAuthorityResourceAdapterTest {

    @InjectMocks
    private VerifierAuthorityResourceAdapter verifierAuthorityResourceAdapter;

    @Mock
    private VerifierAuthorityResourceService verifierAuthorityResourceService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private RequestTaskRepository taskRepository;

    @Test
    void getUserScopedRequestTaskTypesByAccountTypeVerifierAdmin() {
        final String userId = "userId";
        final AppUser user = AppUser.builder().userId(userId)
                .authorities(List.of(AppAuthority.builder()
                        .permissions(List.of(Permission.PERM_VB_ACCESS_ALL_ACCOUNTS)).build()))
                .build();
        final Long vbId = 1L;
        final AccountType accountType = AccountType.ORGANISATION;

        when(accountRepository.findAllIdsByVerificationBody(vbId)).thenReturn(List.of(3L, 4L));
        when(verifierAuthorityResourceService.findUserScopedRequestTaskTypes(userId))
                .thenReturn(Map.of(
                        1L,
                        Set.of(
                                RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name(),
                                NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT.name()
                        )
                ));

        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypesByAccountType =
                verifierAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(user, accountType);

        assertThat(userScopedRequestTaskTypesByAccountType).containsExactlyInAnyOrderEntriesOf(
                Map.of(3L, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT),
                        4L, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT))
        );
    }

    @Test
    void getUserScopedRequestTaskTypesByAccountTypeVerifier() {
        final String userId = "userId";
        final AppUser user = AppUser.builder().userId(userId)
                .authorities(List.of(AppAuthority.builder()
                        .permissions(List.of()).build()))
                .build();
        final AccountType accountType = AccountType.ORGANISATION;

        final Long vbId = 1L;
        final List<Long> accountIds = List.of(2L, 3L);
        final Set<String> taskTypesString = Set.of(
                RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name(),
                NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT.name()
        );
        final Set<RequestTaskType> taskTypes = Set.of(
                RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW,
                NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT
        );
        when(verifierAuthorityResourceService.findUserScopedRequestTaskTypes(userId))
                .thenReturn(Map.of(
                        vbId,
                        taskTypesString
                ));
        when(taskRepository.findAccountIdsByTaskAssigneeAndTaskTypeInAndVerificationBody( "userId", taskTypes, vbId))
                .thenReturn(accountIds);

        Map<Long, Set<RequestTaskType>> userScopedRequestTaskTypesByAccountType =
                verifierAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(user, accountType);

        assertThat(userScopedRequestTaskTypesByAccountType).containsExactlyInAnyOrderEntriesOf(
                Map.of(2L, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT),
                        3L, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW, NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT))
        );
    }
}