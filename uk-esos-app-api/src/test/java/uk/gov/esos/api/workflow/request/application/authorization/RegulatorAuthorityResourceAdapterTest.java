package uk.gov.esos.api.workflow.request.application.authorization;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.authorization.rules.services.resource.RegulatorAuthorityResourceService;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegulatorAuthorityResourceAdapterTest {

    @InjectMocks
    private RegulatorAuthorityResourceAdapter regulatorAuthorityResourceAdapter;

    @Mock
    private RegulatorAuthorityResourceService regulatorAuthorityResourceService;

    @Test
    void getUserScopedRequestTaskTypesByAccountType() {
        final String userId = "userId";
        final CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        final AccountType accountType = AccountType.ORGANISATION;

        when(regulatorAuthorityResourceService.findUserScopedRequestTaskTypes(userId))
            .thenReturn(Map.of(
                competentAuthority,
                Set.of(
                    RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW.name()))
            );

        Map<CompetentAuthorityEnum, Set<RequestTaskType>> userScopedRequestTaskTypesByAccountType =
            regulatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(userId, accountType);

        assertThat(userScopedRequestTaskTypesByAccountType).containsExactlyEntriesOf(
            Map.of(
                competentAuthority, Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
            )
        );
    }
}