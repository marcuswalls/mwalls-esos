package uk.gov.esos.api.account.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.domain.dto.AccountInfoDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AccountMapper {

	AccountInfoDTO toAccountInfoDTO(Account account);
}
