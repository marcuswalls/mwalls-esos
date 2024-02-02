package uk.gov.esos.api.workflow.payment.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.payment.client.domain.PaymentResponse;
import uk.gov.esos.api.workflow.payment.domain.dto.PaymentCreateResult;
import uk.gov.esos.api.workflow.payment.domain.dto.PaymentGetResult;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface PaymentMapper {

    @Mapping(target = "nextUrl", source = "paymentResponse.links.nextUrl.href")
    PaymentGetResult toPaymentGetResult(PaymentResponse paymentResponse);

    @Mapping(target = "nextUrl", source = "paymentResponse.links.nextUrl.href")
    PaymentCreateResult toPaymentCreateResult(PaymentResponse paymentResponse);
}
