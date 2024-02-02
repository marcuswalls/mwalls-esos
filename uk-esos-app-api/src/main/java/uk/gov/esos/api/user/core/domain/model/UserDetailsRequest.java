package uk.gov.esos.api.user.core.domain.model;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.user.core.domain.model.core.SignatureRequest;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsRequest {

    private String id;
    
    @Valid
    private SignatureRequest signature;

}
