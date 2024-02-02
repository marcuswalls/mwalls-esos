package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.workflow.request.core.domain.RequestActionPayload;
import uk.gov.esos.api.workflow.request.core.domain.dto.AccountOriginatedData;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NotificationOfComplianceP3ApplicationRequestActionPayload extends RequestActionPayload {

    private AccountOriginatedData accountOriginatedData;

    private NocP3 noc;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<UUID, String> nocAttachments = new HashMap<>();


}
