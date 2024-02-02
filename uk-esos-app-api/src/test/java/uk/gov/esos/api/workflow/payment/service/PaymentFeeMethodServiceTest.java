package uk.gov.esos.api.workflow.payment.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.payment.domain.PaymentFeeMethod;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.esos.api.workflow.payment.repository.PaymentFeeMethodRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

@ExtendWith(MockitoExtension.class)
class PaymentFeeMethodServiceTest {

    @InjectMocks
    private PaymentFeeMethodService paymentFeeService;

    @Mock
    private PaymentFeeMethodRepository paymentFeeMethodRepository;

    @Test
    void getMethodFeeType() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;
        PaymentFeeMethod paymentFeeMethod = PaymentFeeMethod.builder()
            .competentAuthority(competentAuthority)
            .requestType(requestType)
            .type(FeeMethodType.STANDARD)
            .build();

        when(paymentFeeMethodRepository.findByCompetentAuthorityAndRequestType(competentAuthority, requestType))
            .thenReturn(Optional.of(paymentFeeMethod));

        Optional<FeeMethodType> feeMethodType =
            paymentFeeService.getFeeMethodType(competentAuthority, requestType);

        assertEquals(Optional.of(FeeMethodType.STANDARD), feeMethodType);

    }

    @Test
    void getMethodFeeType_not_found() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        RequestType requestType = RequestType.ORGANISATION_ACCOUNT_OPENING;

        when(paymentFeeMethodRepository.findByCompetentAuthorityAndRequestType(competentAuthority, requestType))
            .thenReturn(Optional.empty());

        Optional<FeeMethodType> feeMethodType =
                paymentFeeService.getFeeMethodType(competentAuthority, requestType);

        assertTrue(feeMethodType.isEmpty());
    }
}