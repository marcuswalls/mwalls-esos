package uk.gov.esos.api.mireport.organisation.outstandingrequesttasks;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTask;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksMiReportResult;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksReportService;
import uk.gov.esos.api.mireport.common.outstandingrequesttasks.OutstandingRequestTasksRepository;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationOutstandingRequestTasksReportGeneratorHandlerTest {

    @InjectMocks
    private OrganisationOutstandingRequestTasksReportGeneratorHandler generator;

    @Mock
    private OutstandingRequestTasksRepository repository;

    @Mock
    private OutstandingRequestTasksReportService outstandingRequestTasksReportService;

    @Mock
    private UserAuthService userAuthService;

    @Mock
    private EntityManager entityManager;

    @Captor
    private ArgumentCaptor<OutstandingRegulatorRequestTasksMiReportParams> argumentCaptor;

    @Test
    void generateMiReport() {
        String userId1 = UUID.randomUUID().toString();
        String userId2 = UUID.randomUUID().toString();
        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
            .userIds(Set.of(userId1, userId2))
            .requestTaskTypes(
                new HashSet<>(List.of(
                    RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW,
                    RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT
                )))
            .build();

        List<OutstandingRequestTask> expectedOutstandingRequestTasks = List.of(
            OutstandingRequestTask.builder()
                .organisationId("organisationId1")
                .accountType(AccountType.ORGANISATION)
                .legalEntityName("legal1")
                .requestId(UUID.randomUUID().toString())
                .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .requestTaskType(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
                .requestTaskAssignee(userId1)
                .requestTaskAssigneeName("Jon Jones")
                .requestTaskDueDate(null)
                .requestTaskRemainingDays(null)
                .build(),
            OutstandingRequestTask.builder()
                .organisationId("organisationId2")
                .accountType(AccountType.ORGANISATION)
                .legalEntityName("legal2")
                .requestId(UUID.randomUUID().toString())
                .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .requestTaskType(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
                .requestTaskAssignee(userId2)
                .requestTaskAssigneeName("Stan Smith")
                .requestTaskDueDate(LocalDate.now().plusDays(10))
                .requestTaskRemainingDays(10L)
                .build()
        );

        when(outstandingRequestTasksReportService.getRequestTaskTypesByRoleTypeAndAccountType(RoleType.REGULATOR, AccountType.ORGANISATION))
            .thenReturn(Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));

        when(repository.findOutstandingRequestTaskParams(any(), argumentCaptor.capture())).thenReturn(expectedOutstandingRequestTasks);
        when(userAuthService.getUsers(List.of(userId1, userId2))).thenReturn(
            List.of(
                UserInfo.builder().id(userId1).firstName("Jon").lastName("Jones").build(),
                UserInfo.builder().id(userId2).firstName("Stan").lastName("Smith").build()
            )
        );
        
        OutstandingRequestTasksMiReportResult miReportResult = (OutstandingRequestTasksMiReportResult) generator.generateMiReport(entityManager, params);

        assertThat(miReportResult.getResults()).hasSize(2);
        assertThat(argumentCaptor.getValue().getRequestTaskTypes()).containsExactly(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        assertThat(miReportResult.getResults()).containsExactlyElementsOf(expectedOutstandingRequestTasks);
        assertThat(miReportResult.getReportType()).isEqualTo(MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS);
    }

    @Test
    void generateMiReport_all_request_tasks() {
        String userId1 = UUID.randomUUID().toString();
        String userId2 = UUID.randomUUID().toString();
        OutstandingRegulatorRequestTasksMiReportParams params = OutstandingRegulatorRequestTasksMiReportParams.builder()
            .userIds(Set.of(userId1, userId2))
            .requestTaskTypes(new HashSet<>())
            .build();

        List<OutstandingRequestTask> expectedOutstandingRequestTasks = List.of(
            OutstandingRequestTask.builder()
                .organisationId("organisationId1")
                .accountType(AccountType.ORGANISATION)
                .legalEntityName("legal1")
                .requestId(UUID.randomUUID().toString())
                .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .requestTaskType(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
                .requestTaskAssignee(userId1)
                .requestTaskAssigneeName("Jon Jones")
                .requestTaskDueDate(null)
                .requestTaskRemainingDays(null)
                .build(),
            OutstandingRequestTask.builder()
                .organisationId("organisationId2")
                .accountType(AccountType.ORGANISATION)
                .legalEntityName("legal2")
                .requestId(UUID.randomUUID().toString())
                .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .requestTaskType(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW)
                .requestTaskAssignee(userId2)
                .requestTaskAssigneeName("Stan Smith")
                .requestTaskDueDate(LocalDate.now().plusDays(10))
                .requestTaskRemainingDays(10L)
                .build()
        );

        when(outstandingRequestTasksReportService.getRequestTaskTypesByRoleTypeAndAccountType(RoleType.REGULATOR, AccountType.ORGANISATION))
            .thenReturn(Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));

        when(repository.findOutstandingRequestTaskParams(any(), argumentCaptor.capture())).thenReturn(expectedOutstandingRequestTasks);
        when(userAuthService.getUsers(List.of(userId1, userId2))).thenReturn(
            List.of(
                UserInfo.builder().id(userId1).firstName("Jon").lastName("Jones").build(),
                UserInfo.builder().id(userId2).firstName("Stan").lastName("Smith").build()
            )
        );

        OutstandingRequestTasksMiReportResult miReportResult = (OutstandingRequestTasksMiReportResult) generator.generateMiReport(entityManager, params);

        assertThat(miReportResult.getResults()).hasSize(2);
        assertThat(argumentCaptor.getValue().getRequestTaskTypes()).containsExactly(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
        assertThat(miReportResult.getResults()).containsExactlyElementsOf(expectedOutstandingRequestTasks);
        assertThat(miReportResult.getReportType()).isEqualTo(MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS);
    }

}
