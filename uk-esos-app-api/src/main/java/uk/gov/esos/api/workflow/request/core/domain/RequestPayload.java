package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestPayload;

import java.math.BigDecimal;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "payloadType", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = OrganisationAccountOpeningRequestPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_REQUEST_PAYLOAD"),
    @JsonSubTypes.Type(value = NotificationOfComplianceP3RequestPayload.class, name = "NOTIFICATION_OF_COMPLIANCE_P3_REQUEST_PAYLOAD"),
})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestPayload implements Payload {

    private RequestPayloadType payloadType;

    private String operatorAssignee;

    private String regulatorAssignee;
    
    private String verifierAssignee;

    private String supportingOperator;

    private String supportingRegulator;

    private String regulatorReviewer;
    
    private Boolean paymentCompleted;
    
    private BigDecimal paymentAmount;
}
