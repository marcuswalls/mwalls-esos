package uk.gov.esos.api.mireport.common.outstandingrequesttasks;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.taskview.RequestTaskViewService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

import java.util.Set;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OutstandingRequestTasksReportServiceTest {

    @InjectMocks
    private OutstandingRequestTasksReportService service;

    @Mock
    private RequestTaskViewService requestTaskViewService;

    @Test
    void getRequestTasks() {
        final String user = "user";
        final AppUser pmrvUser = AppUser.builder().userId(user).firstName("fn").lastName("ln").roleType(RoleType.REGULATOR).build();
        Set<RequestTaskType> expectedRequestTaskTypes = Set.of(
            RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);

        when(requestTaskViewService.getRequestTaskTypes(RoleType.REGULATOR)).thenReturn(expectedRequestTaskTypes);

        Set<RequestTaskType> actualRequestTasks =
            service.getRequestTaskTypesByRoleTypeAndAccountType(pmrvUser.getRoleType(), AccountType.ORGANISATION);

        Assertions.assertThat(actualRequestTasks.size()).isEqualTo(expectedRequestTaskTypes.size());
        Assertions.assertThat(actualRequestTasks).containsAll(Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));
    }
}
