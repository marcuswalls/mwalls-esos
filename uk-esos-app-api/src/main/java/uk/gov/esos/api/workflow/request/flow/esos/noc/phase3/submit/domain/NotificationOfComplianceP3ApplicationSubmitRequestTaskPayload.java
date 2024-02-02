package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.submit.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3ApplicationRequestTaskPayload;

@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload extends NotificationOfComplianceP3ApplicationRequestTaskPayload {
}
