package uk.gov.esos.api.mireport.organisation.executedactions;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestAction;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportResult;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationExecutedRequestActionsReportGeneratorHandlerTest {

    @InjectMocks
    private OrganisationExecutedRequestActionsReportGeneratorHandler generator;

    @Mock
    private OrganisationExecutedRequestActionsRepository repository;

    @Mock
    private EntityManager entityManager;

    @Test
    void generateMiReport() {
        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
            .reportType(MiReportType.COMPLETED_WORK)
            .fromDate(LocalDate.now())
            .build();
        List<ExecutedRequestAction> executedRequestActions = List.of(
            ExecutedRequestAction.builder()
                .organisationId("organisationId")
                .accountName("accountName")
                .accountStatus(OrganisationAccountStatus.LIVE.name())
                .accountType(AccountType.ORGANISATION)
                .requestId("REQ-1")
                .requestType(RequestType.ORGANISATION_ACCOUNT_OPENING)
                .requestStatus(RequestStatus.IN_PROGRESS)
                .requestActionType(RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED)
                .requestActionSubmitter("submitter")
                .requestActionCompletionDate(LocalDateTime.now())
                .build());

        when(repository.findExecutedRequestActions(entityManager, reportParams)).thenReturn(executedRequestActions);

        ExecutedRequestActionsMiReportResult report =
            (ExecutedRequestActionsMiReportResult) generator.generateMiReport(entityManager, reportParams);

        assertNotNull(report);
        assertEquals(MiReportType.COMPLETED_WORK, report.getReportType());
        assertThat(report.getResults()).containsExactlyElementsOf(executedRequestActions);
    }

    @Test
    void getReportType() {
        assertThat(generator.getReportType()).isEqualTo(MiReportType.COMPLETED_WORK);
    }
}