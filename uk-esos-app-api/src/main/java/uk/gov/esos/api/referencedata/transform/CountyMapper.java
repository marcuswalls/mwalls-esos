package uk.gov.esos.api.referencedata.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.referencedata.domain.County;
import uk.gov.esos.api.referencedata.domain.dto.CountyDTO;

/**
 * The county mapper.
 */
@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface CountyMapper extends ReferenceDataMapper<County, CountyDTO>{

}
