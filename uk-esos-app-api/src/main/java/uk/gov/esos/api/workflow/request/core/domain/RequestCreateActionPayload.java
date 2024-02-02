package uk.gov.esos.api.workflow.request.core.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.esos.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.domain.OrganisationAccountOpeningSubmitApplicationCreateActionPayload;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "payloadType", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = OrganisationAccountOpeningSubmitApplicationCreateActionPayload.class, name = "ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION_PAYLOAD"),
    @JsonSubTypes.Type(value = ReportRelatedRequestCreateActionPayload.class, name = "REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD"),
    @JsonSubTypes.Type(value = RequestCreateActionEmptyPayload.class, name = "EMPTY_PAYLOAD"),
})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class RequestCreateActionPayload {

    private RequestCreateActionPayloadType payloadType;
}
