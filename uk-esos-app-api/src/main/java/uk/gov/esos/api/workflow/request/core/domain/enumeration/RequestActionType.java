package uk.gov.esos.api.workflow.request.core.domain.enumeration;

/**
 * Request Action Types.
 */
public enum RequestActionType {

    // Organisation Account relevant request actions
    ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
    ORGANISATION_ACCOUNT_OPENING_APPROVED,
    ORGANISATION_ACCOUNT_OPENING_REJECTED,

    //Notification of compliance phase 3
    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SENT_TO_EDIT,
    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMITTED,
    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_RETURNED_TO_SUBMIT,

    // rfi
    RFI_SUBMITTED,
    RFI_CANCELLED,
    RFI_EXPIRED,
    RFI_RESPONSE_SUBMITTED,

    // Request for Determination Extension (RDE)
    RDE_SUBMITTED,
    RDE_ACCEPTED,
    RDE_REJECTED,
    RDE_FORCE_ACCEPTED,
    RDE_FORCE_REJECTED,
    RDE_EXPIRED,
    RDE_CANCELLED,
    
    //payment related request actions
    PAYMENT_MARKED_AS_PAID,
    PAYMENT_MARKED_AS_RECEIVED,
    PAYMENT_COMPLETED,
    PAYMENT_CANCELLED,

    // common action type for requests terminated by the system
    REQUEST_TERMINATED,
    VERIFICATION_STATEMENT_CANCELLED
}
