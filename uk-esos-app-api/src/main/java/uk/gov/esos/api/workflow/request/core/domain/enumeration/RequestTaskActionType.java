package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import java.util.List;
import java.util.Set;

public enum RequestTaskActionType {

    //Organisation account related request task actions
    ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION,
    ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION,

    // Notification of Compliance relevant request task actions
    NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT,
    NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT,
    NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT,
    NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION,
    NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT,
    NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT,
    
    // rfi
    RFI_SUBMIT,
    RFI_UPLOAD_ATTACHMENT,
    RFI_RESPONSE_SUBMIT,
    RFI_CANCEL,

    // Request for Determination Extension (RDE)
    RDE_SUBMIT,
    RDE_RESPONSE_SUBMIT,
    RDE_FORCE_DECISION,
    RDE_UPLOAD_ATTACHMENT,

    // payment related task actions
    PAYMENT_MARK_AS_PAID,
    PAYMENT_MARK_AS_RECEIVED,
    PAYMENT_PAY_BY_CARD,
    PAYMENT_CANCEL,
    ;


    public static Set<RequestTaskActionType> getRequestPeerReviewTypesBlockedByPayment() {
        return Set.of();
    }

    public static Set<RequestTaskActionType> getNotifyOperatorForDecisionTypesBlockedByPayment() {
        return Set.of();
    }
    
    public static Set<RequestTaskActionType> getRfiRdeSubmissionTypes() {
        return Set.of(RFI_SUBMIT, RDE_SUBMIT);
    }

    public static List<RequestTaskActionType> getMakePaymentAllowedTypes() {
        return List.of(PAYMENT_MARK_AS_PAID, PAYMENT_PAY_BY_CARD);
    }

    public static List<RequestTaskActionType> getTrackAndConfirmPaymentAllowedTypes() {
        return List.of(PAYMENT_MARK_AS_RECEIVED, PAYMENT_CANCEL);
    }
}
