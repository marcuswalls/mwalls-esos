package uk.gov.esos.api.verificationbody.domain.verificationreport;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.verificationbody.domain.verificationbodydetails.VerificationBodyDetails;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class VerificationReport {

    // To be set on Verification submit
    private Long verificationBodyId;

    private VerificationBodyDetails verificationBodyDetails;
}
