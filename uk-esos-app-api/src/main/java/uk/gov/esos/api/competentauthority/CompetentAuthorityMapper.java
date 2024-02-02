package uk.gov.esos.api.competentauthority;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;
import uk.gov.esos.api.common.transform.MapperConfig;

@Mapper(
        componentModel = "spring",
        config = MapperConfig.class
)
public interface CompetentAuthorityMapper {

    CompetentAuthorityDTO toCompetentAuthorityDTO(CompetentAuthority competentAuthority);

    @Mapping(target = "email", ignore = true)
    @Mapping(target = "name", source = "competentAuthority.name")
    CompetentAuthorityDTO toCompetentAuthorityDTO(CompetentAuthority competentAuthority, AccountType accountType);

    @AfterMapping
    default void populateEmail(@MappingTarget CompetentAuthorityDTO competentAuthorityDTO, CompetentAuthority competentAuthority) {
        competentAuthorityDTO.setEmail(competentAuthority.getEmail());
    }
}
