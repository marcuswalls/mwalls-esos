package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain.NotificationOfComplianceRequestMetadata;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class NotificationOfComplianceP3RequestMetadata extends NotificationOfComplianceRequestMetadata {
}
