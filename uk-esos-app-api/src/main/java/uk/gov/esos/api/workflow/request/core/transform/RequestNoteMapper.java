package uk.gov.esos.api.workflow.request.core.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.RequestNote;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestNoteDto;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RequestNoteMapper {

    RequestNoteDto toRequestNoteDTO(RequestNote requestNote);
}
