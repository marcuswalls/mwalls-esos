package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RequestCreateActionType {
    ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION(RequestType.ORGANISATION_ACCOUNT_OPENING),
    NOTIFICATION_OF_COMPLIANCE_P3(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);

    private final RequestType type;
}
