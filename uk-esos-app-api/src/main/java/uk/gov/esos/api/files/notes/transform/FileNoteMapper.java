package uk.gov.esos.api.files.notes.transform;

import java.io.IOException;
import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.notes.domain.FileNote;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface FileNoteMapper {

    FileNote toFileNote(FileDTO fileDTO) throws IOException;

}
