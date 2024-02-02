package uk.gov.esos.api.workflow.request.flow.payment.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.payment.domain.dto.PaymentGetResult;
import uk.gov.esos.api.workflow.request.flow.payment.domain.CardPaymentProcessResponseDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface CardPaymentMapper {

    CardPaymentProcessResponseDTO toCardPaymentProcessResponseDTO(PaymentGetResult paymentGetResult);
}
