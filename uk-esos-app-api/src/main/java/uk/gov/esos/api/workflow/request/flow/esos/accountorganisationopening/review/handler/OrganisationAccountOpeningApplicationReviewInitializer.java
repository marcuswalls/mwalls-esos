package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.mapper.OrganisationAccountOpeningReviewMapper;

import java.util.Set;

@Service
public class OrganisationAccountOpeningApplicationReviewInitializer implements InitializeRequestTaskHandler {

    private static final OrganisationAccountOpeningReviewMapper ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER = Mappers.getMapper(OrganisationAccountOpeningReviewMapper.class);


    @Override
    public RequestTaskPayload initializePayload(Request request) {
        OrganisationAccountOpeningRequestPayload requestPayload = (OrganisationAccountOpeningRequestPayload) request.getPayload();
        return ORGANISATION_ACCOUNT_OPENING_REVIEW_MAPPER.toOrganisationAccountOpeningApplicationRequestTaskPayload(requestPayload);
    }

    @Override
    public Set<RequestTaskType> getRequestTaskTypes() {
        return Set.of(RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW);
    }
}
