package uk.gov.esos.api.workflow.request.flow.esos.item.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ItemOrganisationDTO extends ItemDTO {

    @JsonUnwrapped
    private ItemOrganisationAccountDTO account;
}
