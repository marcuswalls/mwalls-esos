package uk.gov.esos.api.workflow.request.flow.common.service.notification;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

class RequestTypeDocumentTemplateInfoMapperTest {

    @Test
    void test() {
        assertThat(RequestTypeDocumentTemplateInfoMapper.getTemplateInfo(RequestType.ORGANISATION_ACCOUNT_OPENING)).isEqualTo("N/A");
    }
}
