package uk.gov.esos.api.workflow.payment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.payment.domain.PaymentFeeMethod;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.esos.api.workflow.payment.repository.PaymentFeeMethodRepository;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentFeeMethodService {

    private final PaymentFeeMethodRepository paymentFeeMethodRepository;

    public Optional<FeeMethodType> getFeeMethodType(CompetentAuthorityEnum competentAuthority, RequestType requestType) {
        return paymentFeeMethodRepository.findByCompetentAuthorityAndRequestType(competentAuthority, requestType)
                .map(PaymentFeeMethod::getType)
                .or(Optional::empty);
    }
}
