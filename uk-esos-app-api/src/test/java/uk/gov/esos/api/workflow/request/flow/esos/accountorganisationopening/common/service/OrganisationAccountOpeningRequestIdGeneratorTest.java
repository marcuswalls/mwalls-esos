package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.service;

import org.junit.jupiter.api.Test;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.service.OrganisationAccountOpeningRequestIdGenerator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class OrganisationAccountOpeningRequestIdGeneratorTest {

    private final OrganisationAccountOpeningRequestIdGenerator generator = new OrganisationAccountOpeningRequestIdGenerator();

    @Test
    void generate() {
        Long accountId = 98L;
        RequestParams params = RequestParams.builder().accountId(accountId).build();

        String actual = generator.generate(params);

        assertEquals("ACC000098", actual);
    }

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsOnly(RequestType.ORGANISATION_ACCOUNT_OPENING);
    }

    @Test
    void getPrefix() {
        assertEquals("ACC", generator.getPrefix());
    }
}