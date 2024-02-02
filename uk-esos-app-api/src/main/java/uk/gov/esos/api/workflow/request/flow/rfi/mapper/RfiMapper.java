package uk.gov.esos.api.workflow.request.flow.rfi.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rfi.domain.RfiSubmittedRequestActionPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RfiMapper {
    
    @Mapping(target = "payloadType", expression = "java(uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType.RFI_SUBMITTED_PAYLOAD)")
    RfiSubmittedRequestActionPayload toRfiSubmittedRequestActionPayload(RfiSubmitRequestTaskActionPayload taskActionPayload);
}
