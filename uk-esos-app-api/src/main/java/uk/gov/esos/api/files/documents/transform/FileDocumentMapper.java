package uk.gov.esos.api.files.documents.transform;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.files.documents.domain.FileDocument;

@Mapper(componentModel = "spring", config = MapperConfig.class, imports = UUID.class)
public interface FileDocumentMapper {

    FileDTO toFileDTO(FileDocument fileDocument);
    
    @Mapping(target = "name", source = "fileName")
    FileInfoDTO toFileInfoDTO(FileDocument fileDocument);
}
