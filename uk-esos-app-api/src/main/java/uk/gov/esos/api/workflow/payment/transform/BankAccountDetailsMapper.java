package uk.gov.esos.api.workflow.payment.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.payment.domain.BankAccountDetails;
import uk.gov.esos.api.workflow.payment.domain.dto.BankAccountDetailsDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface BankAccountDetailsMapper {

    BankAccountDetailsDTO toBankAccountDetailsDTO(BankAccountDetails bankAccountDetails);
}
