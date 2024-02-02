package uk.gov.esos.api.workflow.payment.service;

import java.math.BigDecimal;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.esos.api.workflow.request.core.domain.Request;

public interface FeePaymentService {

    BigDecimal getAmount(Request request);
    FeeMethodType getFeeMethodType();
}
