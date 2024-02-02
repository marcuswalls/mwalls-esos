package uk.gov.esos.api.terms.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.terms.domain.Terms;
import uk.gov.esos.api.terms.domain.dto.TermsDTO;

/**
 * The Terms Mapper.
 */
@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface TermsMapper {

    TermsDTO transformToTermsDTO(Terms terms);

}
