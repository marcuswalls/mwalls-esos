package uk.gov.esos.api.notification.template.service;

import fr.opensagres.xdocreport.template.freemarker.FreemarkerTemplateEngine;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import uk.gov.esos.api.common.utils.MimeTypeUtils;
import uk.gov.esos.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.competentauthority.CompetentAuthorityService;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.notification.template.TemplatesConfiguration;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.AccountTemplateParams;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.CompetentAuthorityTemplateParams;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.SignatoryTemplateParams;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.TemplateParams;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.WorkflowTemplateParams;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class DocumentTemplateProcessServiceTest {
    private static FreemarkerTemplateEngine freemarkerTemplateEngine;

    @BeforeAll
    public static void init() {
        TemplatesConfiguration templatesConfiguration = new TemplatesConfiguration();
        freemarker.template.Configuration freemarkerConfig = templatesConfiguration.freemarkerConfig();
        freemarkerTemplateEngine = templatesConfiguration.freemarkerTemplateEngine(freemarkerConfig);
    }

    @Test
    void generateFileDocumentFromTemplate_rfi_template() throws IOException, DocumentTemplateProcessException {
        CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
        String signatoryUser = "Signatory user full name";
        Path rfiTemplateFilePath = Paths.get("src", "test", "resources", "templates", "L025_P3_Request_for_further_information_notice_20130402.docx");
        FileDTO rfiTemplateEnglandFile = createFile(rfiTemplateFilePath);

        Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
        FileDTO signatureFile = createFile(signatureFilePath);

        Map<String, Object> params = new HashMap<>();
        Date deadlineDate = Date.from(LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        params.put("deadline", deadlineDate);
        params.put("questions", List.of("question1", "question2"));

        TemplateParams templateParams = buildTemplateParams(ca, signatoryUser, signatureFile, params);

        byte[] generatedPdfFile = new DocumentTemplateProcessService(freemarkerTemplateEngine)
                .generateFileDocumentFromTemplate(rfiTemplateEnglandFile, templateParams, "fileNameToGenerate");

        //assertions
        try (PDDocument pdfDoc = PDDocument.load(generatedPdfFile)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            pdfStripper.setSortByPosition(true);
            pdfStripper.setStartPage(0);
            pdfStripper.setLineSeparator(" ");
            pdfStripper.setEndPage(pdfDoc.getNumberOfPages());
            String pdfText = pdfStripper.getText(pdfDoc);

            assertThat(pdfText).contains(templateParams.getPermitId());
            assertThat(pdfText).contains(templateParams.getCompetentAuthorityParams().getName());
            assertThat(pdfText).contains(templateParams.getSignatoryParams().getFullName());
            assertThat(pdfText).contains("question1");
            assertThat(pdfText).contains("question2");
            assertThat(pdfText).contains(new SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH).format(deadlineDate));
        }
    }

    private TemplateParams buildTemplateParams(CompetentAuthorityEnum ca, String signatoryUser, FileDTO signatureFile,
                                               Map<String, Object> params) {
        CompetentAuthorityDTO caDto = CompetentAuthorityDTO.builder().id(ca).email("email").name("name").build();
        AccountTemplateParams accountParams = Mockito.mock(AccountTemplateParams.class);
        return TemplateParams.builder()
                .competentAuthorityParams(CompetentAuthorityTemplateParams.builder()
                        .competentAuthority(caDto)
                        .logo(CompetentAuthorityService.getCompetentAuthorityLogo(ca))
                        .build())
                .competentAuthorityCentralInfo("ca central info")
                .signatoryParams(SignatoryTemplateParams.builder()
                        .fullName(signatoryUser)
                        .signature(signatureFile.getFileContent())
                        .jobTitle("Project Manager")
                        .build())
                .accountParams(accountParams)
                .permitId("UK-E-IN-12345")
                .workflowParams(WorkflowTemplateParams.builder()
                        .requestId("123")
                        .requestType("PERMIT_VARIATION") //("PERMIT_ISSUANCE")
                        .requestTypeInfo("your permit variation")
                        .requestSubmissionDate(new Date())
                        .requestEndDate(LocalDateTime.of(1998, 1, 1, 1, 1))
                        .build())
                .params(params)
                .build();
    }

    private FileDTO createFile(Path sampleFilePath) throws IOException {
        byte[] bytes = Files.readAllBytes(sampleFilePath);
        return FileDTO.builder()
                .fileContent(bytes)
                .fileName(sampleFilePath.getFileName().toString())
                .fileSize(sampleFilePath.toFile().length())
                .fileType(MimeTypeUtils.detect(bytes, sampleFilePath.getFileName().toString()))
                .build();
    }
}
