package uk.gov.esos.api.workflow.request.application.item.domain.dto;

import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import uk.gov.esos.api.workflow.request.flow.esos.item.domain.ItemOrganisationDTO;

@Data
@Builder
public class ItemDTOResponse {

    //Do not remove @Schema annotation. Needed for swagger to properly generate implementations of ItemDTO
    @Schema(oneOf = ItemOrganisationDTO.class)
    List<ItemDTO> items;

    Long totalItems;

    public static ItemDTOResponse emptyItemDTOResponse() {
        return ItemDTOResponse.builder().items(Collections.emptyList()).totalItems(0L).build();
    }

}
