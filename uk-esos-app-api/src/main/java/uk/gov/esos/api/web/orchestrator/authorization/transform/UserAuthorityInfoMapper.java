package uk.gov.esos.api.web.orchestrator.authorization.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.UserAuthorityInfoDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface UserAuthorityInfoMapper {

    @Mapping(target = "userId", source = "userInfo.userId")
    @Mapping(target = "authorityCreationDate", source = "userAuthority.authorityCreationDate")
    @Mapping(target = "locked", expression = "java(userInfo.getLocked())")
    UserAuthorityInfoDTO toUserAuthorityInfo(UserAuthorityDTO userAuthority, UserInfoDTO userInfo);
}
