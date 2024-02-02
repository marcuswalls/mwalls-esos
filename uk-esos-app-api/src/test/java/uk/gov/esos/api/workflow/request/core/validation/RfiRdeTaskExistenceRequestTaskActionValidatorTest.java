package uk.gov.esos.api.workflow.request.core.validation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Set;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

class RfiRdeTaskExistenceRequestTaskActionValidatorTest {

    private final RfiRdeTaskExistenceRequestTaskActionValidator validator = new RfiRdeTaskExistenceRequestTaskActionValidator();

    @Test
    void getTypes() {
        assertThat(validator.getTypes()).isEqualTo(Set.of(
                RequestTaskActionType.RFI_SUBMIT,
                RequestTaskActionType.RDE_SUBMIT)
        );
    }

    @Test
    void getConflictingRequestTaskTypes() {
        assertEquals(RequestTaskType.getRfiRdeWaitForResponseTypes(), validator.getConflictingRequestTaskTypes());
    }
}
