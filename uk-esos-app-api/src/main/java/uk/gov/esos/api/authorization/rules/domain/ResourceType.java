package uk.gov.esos.api.authorization.rules.domain;

public enum ResourceType {

    ACCOUNT,
    CA,
    VERIFICATION_BODY,

    REQUEST,
    REQUEST_TASK,
    REQUEST_ACTION,

    NOTIFICATION_TEMPLATE,
    DOCUMENT_TEMPLATE,
    ACCOUNT_NOTE,
    REQUEST_NOTE,
}
