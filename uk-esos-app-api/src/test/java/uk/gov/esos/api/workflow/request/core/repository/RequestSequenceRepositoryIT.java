package uk.gov.esos.api.workflow.request.core.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.workflow.request.core.domain.RequestSequence;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import(ObjectMapper.class)
class RequestSequenceRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private RequestSequenceRepository cut;
    
    @Autowired
	private EntityManager entityManager;
    
    @Test
    void findByType() {
    	RequestSequence requestSequence = new RequestSequence(RequestType.ORGANISATION_ACCOUNT_OPENING);
    	entityManager.persist(requestSequence);
    	
        flushAndClear();
        
        Optional<RequestSequence> result = cut.findByType(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
        assertThat(result).isEmpty();
        
        result = cut.findByType(RequestType.ORGANISATION_ACCOUNT_OPENING);
        assertThat(result).isNotEmpty();
        assertThat(result.get().getType()).isEqualTo(RequestType.ORGANISATION_ACCOUNT_OPENING);
    }
    
    @Test
    void findByBusinessIdentifierAndType() {
    	String businessIdentifier = "bi";
    	RequestSequence requestSequence = new RequestSequence(businessIdentifier, RequestType.ORGANISATION_ACCOUNT_OPENING);
    	entityManager.persist(requestSequence);
    	
        flushAndClear();
        
        Optional<RequestSequence> result = cut.findByBusinessIdentifierAndType("another_bi", RequestType.ORGANISATION_ACCOUNT_OPENING);
        assertThat(result).isEmpty();
        
        result = cut.findByBusinessIdentifierAndType(businessIdentifier, RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
        assertThat(result).isEmpty();
        
        result = cut.findByBusinessIdentifierAndType(businessIdentifier, RequestType.ORGANISATION_ACCOUNT_OPENING);
        assertThat(result).isNotEmpty();
        assertThat(result.get().getType()).isEqualTo(RequestType.ORGANISATION_ACCOUNT_OPENING);
        
    }
    
    private void flushAndClear() {
		entityManager.flush();
		entityManager.clear();
	}
}