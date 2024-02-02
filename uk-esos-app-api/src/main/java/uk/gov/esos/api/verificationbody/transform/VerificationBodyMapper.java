package uk.gov.esos.api.verificationbody.transform;

import java.util.List;
import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.verificationbody.domain.VerificationBody;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyDTO;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyEditDTO;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyInfoDTO;
import uk.gov.esos.api.verificationbody.domain.dto.VerificationBodyNameInfoDTO;
import uk.gov.esos.api.verificationbody.domain.verificationbodydetails.VerificationBodyDetails;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface VerificationBodyMapper {

    VerificationBodyDTO toVerificationBodyDTO(VerificationBody verificationBody);

    VerificationBodyInfoDTO toVerificationBodyInfoDTO(VerificationBody verificationBody);

    List<VerificationBodyInfoDTO> toVerificationBodyInfoDTO(List<VerificationBody> verificationBodies);
    
    VerificationBodyNameInfoDTO toVerificationBodyNameInfoDTO(VerificationBody verificationBody);

    VerificationBody toVerificationBody(VerificationBodyEditDTO verificationBodyEditDTO);

    VerificationBodyDetails toVerificationBodyDetails(VerificationBodyDTO verificationBodyDTO);
}
