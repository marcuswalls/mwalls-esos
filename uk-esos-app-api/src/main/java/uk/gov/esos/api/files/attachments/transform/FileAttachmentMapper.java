package uk.gov.esos.api.files.attachments.transform;

import java.io.IOException;
import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.attachments.domain.FileAttachment;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface FileAttachmentMapper {

    FileAttachment toFileAttachment(FileDTO fileDTO) throws IOException;
    
}
