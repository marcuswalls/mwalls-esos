package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateByAccountValidator;

@Service
public class OrganisationAccountOpeningCreateValidator implements RequestCreateByAccountValidator {

    @Override
    public RequestCreateValidationResult validateAction(Long accountId) {
        return RequestCreateValidationResult.builder().valid(accountId == null).build();
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION;
    }
}
