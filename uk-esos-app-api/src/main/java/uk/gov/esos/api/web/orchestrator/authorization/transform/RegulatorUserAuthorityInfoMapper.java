package uk.gov.esos.api.web.orchestrator.authorization.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.user.regulator.domain.RegulatorUserInfoDTO;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.web.orchestrator.authorization.dto.RegulatorUserAuthorityInfoDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RegulatorUserAuthorityInfoMapper {

    @Mapping(target = "locked", expression = "java(userInfo.getEnabled()!=null ? !userInfo.getEnabled() : null)")
    RegulatorUserAuthorityInfoDTO toUserAuthorityInfo(UserAuthorityDTO userAuthority, RegulatorUserInfoDTO userInfo);
}