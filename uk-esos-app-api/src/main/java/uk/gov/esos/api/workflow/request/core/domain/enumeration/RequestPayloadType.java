package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RequestPayloadType {

    ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD,
    NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD,
}
