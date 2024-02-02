package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NotificationOfComplianceP3SaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    private NocP3 noc;

    @Builder.Default
    private Map<String, String> nocSectionsCompleted = new HashMap<>();
}
