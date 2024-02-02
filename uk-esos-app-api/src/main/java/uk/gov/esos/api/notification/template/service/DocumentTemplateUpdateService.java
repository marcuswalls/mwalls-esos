package uk.gov.esos.api.notification.template.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.documents.service.FileDocumentTemplateService;
import uk.gov.esos.api.notification.template.domain.DocumentTemplate;

@Service
@RequiredArgsConstructor
public class DocumentTemplateUpdateService {

    private final DocumentTemplateQueryService documentTemplateQueryService;
    private final FileDocumentTemplateService fileDocumentTemplateService;

    @Transactional
    public void updateDocumentTemplateFile(Long documentTemplateId, FileDTO file, String authUserId) {
        final DocumentTemplate documentTemplate = documentTemplateQueryService.getDocumentTemplateById(documentTemplateId);
        fileDocumentTemplateService.deleteFileDocumentTemplateById(documentTemplate.getFileDocumentTemplateId());
        Long fileDocumentTemplateId = fileDocumentTemplateService.createFileDocumentTemplate(file, authUserId);
        documentTemplate.setFileDocumentTemplateId(fileDocumentTemplateId);        
    }
}
