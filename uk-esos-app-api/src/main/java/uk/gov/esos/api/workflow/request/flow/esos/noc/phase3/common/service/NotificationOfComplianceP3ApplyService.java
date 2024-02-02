package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload;

@Service
public class NotificationOfComplianceP3ApplyService {

    @Transactional
    public void applySaveAction(NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload taskActionPayload, RequestTask requestTask) {
        NotificationOfComplianceP3ApplicationRequestTaskPayload taskPayload =
                (NotificationOfComplianceP3ApplicationRequestTaskPayload) requestTask.getPayload();

        taskPayload.setNoc(taskActionPayload.getNoc());
        taskPayload.setNocSectionsCompleted(taskActionPayload.getNocSectionsCompleted());
    }
}
