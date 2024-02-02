package uk.gov.esos.api.workflow.request.flow.payment;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RequestTypeCardPaymentDescriptionMapperTest {

    @Test
    void getCardPaymentDescription() {
        assertNull(RequestTypeCardPaymentDescriptionMapper.getCardPaymentDescription(RequestType.ORGANISATION_ACCOUNT_OPENING));
    }
}