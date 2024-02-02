package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.noc.common.domain.NocSubmitParams;
import uk.gov.esos.api.reporting.noc.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.service.NocService;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationEnergyResponsibilityType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationReasonType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.OrganisationQualificationType;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligationDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain.NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceP3SubmitServiceTest {

    @InjectMocks
    private NotificationOfComplianceP3SubmitService nocP3SubmitService;

    @Mock
    private NocService nocService;

    @Test
    void submitNocAction() {
        Map<String, String> nocSectionsCompleted = Map.of("section", "completed");
        Map<UUID, String> nocAttachments = Map.of(UUID.randomUUID(), "attachment1");
        NocP3 noc = NocP3.builder()
            .reportingObligation(ReportingObligation.builder()
                .qualificationType(OrganisationQualificationType.QUALIFY)
                .reportingObligationDetails(ReportingObligationDetails.builder()
                    .qualificationReasonTypes(Set.of(OrganisationQualificationReasonType.STAFF_MEMBERS_MORE_THAN_250))
                    .energyResponsibilityType(OrganisationEnergyResponsibilityType.NOT_RESPONSIBLE)
                    .build())
                .build())
            .responsibleUndertaking(ResponsibleUndertaking.builder()
                .organisationDetails(ReviewOrganisationDetails.builder()
                    .name("Organisation name")
                    .build())
                .build())
            .build();
        Long accountId = 1L;
        Request request = Request.builder()
            .type(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)
            .payload(NotificationOfComplianceP3RequestPayload.builder()
                .payloadType(RequestPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD)
                .noc(NocP3.builder().build())
                .build())
            .accountId(accountId)
            .build();
        RequestTask requestTask = RequestTask.builder()
            .type(RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT)
            .request(request)
            .payload(NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT_PAYLOAD)
                .noc(noc)
                .nocAttachments(nocAttachments)
                .nocSectionsCompleted(nocSectionsCompleted)
                .build())
            .build();

        NocSubmitParams nocSubmitParams = NocSubmitParams.builder()
            .accountId(accountId)
            .nocContainer(NocP3Container.builder().phase(Phase.PHASE_3).noc(noc).nocAttachments(nocAttachments).build())
            .build();

        // Invoke
        nocP3SubmitService.submitNocAction(requestTask);

        // Verify
        assertThat(request.getPayload()).isInstanceOf(NotificationOfComplianceP3RequestPayload.class);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocSectionsCompleted())
            .isEqualTo(nocSectionsCompleted);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNocAttachments())
            .isEqualTo(nocAttachments);
        assertThat(((NotificationOfComplianceP3RequestPayload) request.getPayload()).getNoc())
            .isEqualTo(noc);

        verify(nocService, times(1)).submitNoc(nocSubmitParams);
    }
}