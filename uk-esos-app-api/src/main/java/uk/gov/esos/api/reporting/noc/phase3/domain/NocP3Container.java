package uk.gov.esos.api.reporting.noc.phase3.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.reporting.noc.common.domain.NocContainer;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NocP3Container extends NocContainer {

    @Valid
    @NotNull
    private NocP3 noc;
}
