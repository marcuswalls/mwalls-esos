package uk.gov.esos.api.referencedata.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.referencedata.domain.dto.CountryDTO;
import uk.gov.esos.api.referencedata.domain.Country;
import uk.gov.esos.api.common.transform.MapperConfig;

/**
 * The country mapper.
 */
@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface CountryMapper extends ReferenceDataMapper<Country, CountryDTO>{

}
