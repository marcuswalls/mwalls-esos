package uk.gov.esos.api.common.domain.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.common.domain.Address;
import uk.gov.esos.api.common.domain.dto.AddressDTO;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AddressMapper {

    Address toAddress(AddressDTO addressDto);
}
