package uk.gov.esos.api.workflow.request.flow.payment.service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

public interface PaymentDetermineAmountByRequestTypeService extends PaymentDetermineAmountService {

    RequestType getRequestType();
    
}
