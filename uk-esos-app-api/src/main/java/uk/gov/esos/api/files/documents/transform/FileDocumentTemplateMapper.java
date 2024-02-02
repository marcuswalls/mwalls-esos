package uk.gov.esos.api.files.documents.transform;

import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.FileStatus;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.files.documents.domain.FileDocumentTemplate;

@Mapper(componentModel = "spring", config = MapperConfig.class, imports = UUID.class)
public interface FileDocumentTemplateMapper {

    FileDTO toFileDTO(FileDocumentTemplate fileDocumentTemplate);
    
    @Mapping(target = "name", source = "fileName")
    FileInfoDTO toFileInfoDTO(FileDocumentTemplate fileDocumentTemplate);
    
    @Mapping(target = "uuid", expression = "java(UUID.randomUUID().toString())")
    FileDocumentTemplate toFileDocumentTemplate(FileDTO fileDTO, FileStatus status, String createdBy);
}
