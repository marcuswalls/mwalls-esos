package uk.gov.esos.api.files.common.service;

import uk.gov.esos.api.files.common.domain.dto.FileDTO;

import jakarta.validation.Valid;

public interface FileValidatorService {

    void validate(@Valid FileDTO fileDTO);
}
