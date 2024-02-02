package uk.gov.esos.api.workflow.request.core.domain.enumeration;

import lombok.Getter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.APPLICATION_VERIFICATION_SUBMIT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.CONFIRM_PAYMENT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.MAKE_PAYMENT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.RDE_RESPONSE_SUBMIT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.RFI_RESPONSE_SUBMIT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.TRACK_PAYMENT;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.WAIT_FOR_RDE_RESPONSE;
import static uk.gov.esos.api.workflow.request.flow.common.taskhandler.DynamicUserTaskDefinitionKey.WAIT_FOR_RFI_RESPONSE;

/**
 * Task type enum. <br/>
 * Note: The enum is used in bpmn workflow engine to set the user task definition key (ID), e.g. <br/>
 * <i>&lt;bpmn:userTask id="ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW" name="Review application"&gt;</i>
 *
 */
@Getter
public enum RequestTaskType {

    ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW(true, RequestType.ORGANISATION_ACCOUNT_OPENING) {
        @Override
        public List<RequestTaskActionType> getAllowedRequestTaskActionTypes() {
            return List.of(
                RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION,
                RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION);
        }
    },


    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT(true, RequestType.NOTIFICATION_OF_COMPLIANCE_P3) {
        @Override
        public List<RequestTaskActionType> getAllowedRequestTaskActionTypes() {
            return List.of(
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT,
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT,
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT,
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION
            );
        }
    },

    NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT(true, RequestType.NOTIFICATION_OF_COMPLIANCE_P3) {
        @Override
        public List<RequestTaskActionType> getAllowedRequestTaskActionTypes() {
            return List.of(
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT,
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT,
                    RequestTaskActionType.NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT
            );
        }
    },

    NOTIFICATION_OF_COMPLIANCE_P3_WAIT_FOR_EDIT(true, RequestType.NOTIFICATION_OF_COMPLIANCE_P3) {
        @Override
        public List<RequestTaskActionType> getAllowedRequestTaskActionTypes() {
            return List.of();
        }
    };

    private final boolean assignable;
	private final RequestType requestType;
    private final RequestExpirationType expirationKey;

    private RequestTaskType(boolean assignable, RequestType requestType) {
    	this(assignable, requestType, null);
    }

    private RequestTaskType(boolean assignable, RequestType requestType, RequestExpirationType expirationKey) {
    	this.assignable = assignable;
    	this.requestType = requestType;
    	this.expirationKey = expirationKey;
    }

    public abstract List<RequestTaskActionType> getAllowedRequestTaskActionTypes();

    public boolean isExpirable() {
    	return expirationKey != null;
    }

    /**
     * term supportingRequestTaskTypes refers to tasks that may be needed in order to complete another task
     * e.g a) peer review task in order to complete review task
     * b) edit task in order to submit task
     */
    public static Set<RequestTaskType> getSupportingRequestTaskTypes() {
        return Set.of(
            RequestTaskType.NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT
        );
    }

    public static Set<RequestTaskType> getMakePaymentTypes() {
        return Stream.of(RequestTaskType.values())
            .filter(requestTaskType -> requestTaskType.name().endsWith(MAKE_PAYMENT.name()))
            .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getTrackPaymentTypes() {
        return Stream.of(RequestTaskType.values())
            .filter(requestTaskType -> requestTaskType.name().endsWith(TRACK_PAYMENT.name()))
            .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getConfirmPaymentTypes() {
        return Stream.of(RequestTaskType.values())
            .filter(requestTaskType -> requestTaskType.name().endsWith(CONFIRM_PAYMENT.name()))
            .collect(Collectors.toSet());
    }
    
    public static Set<RequestTaskType> getRfiResponseTypes() {
        return Stream.of(RequestTaskType.values())
                .filter(requestTaskType -> requestTaskType.name().endsWith(RFI_RESPONSE_SUBMIT.name()))
                .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getRfiWaitForResponseTypes() {
        return Stream.of(RequestTaskType.values())
                .filter(requestTaskType -> requestTaskType.name().endsWith(WAIT_FOR_RFI_RESPONSE.name()))
                .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getRdeResponseTypes() {
        return Stream.of(RequestTaskType.values())
                .filter(requestTaskType -> requestTaskType.name().endsWith(RDE_RESPONSE_SUBMIT.name()))
                .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getRdeWaitForResponseTypes() {
        return Stream.of(RequestTaskType.values())
                .filter(requestTaskType -> requestTaskType.name().endsWith(WAIT_FOR_RDE_RESPONSE.name()))
                .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getRfiRdeWaitForResponseTypes() {
		return Stream.concat(getRfiWaitForResponseTypes().stream(), getRdeWaitForResponseTypes().stream())
				.collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getWaitForRequestTaskTypes() {
        return Stream.of(RequestTaskType.values())
            .filter(requestTaskType -> requestTaskType.toString().contains("WAIT_FOR"))
            .collect(Collectors.toSet());
    }

    public static Set<RequestTaskType> getTaskTypesRelatedToVerifier() {
        return Stream.of(RequestTaskType.values())
                .filter(requestTaskType -> requestTaskType.toString().endsWith(APPLICATION_VERIFICATION_SUBMIT.name()))
                .collect(Collectors.toSet());
    }
}
