package uk.gov.esos.api.workflow.request.core.domain;

import uk.gov.esos.api.verificationbody.domain.verificationreport.VerificationReport;

public interface RequestPayloadVerifiable<T extends VerificationReport> extends Payload {

    boolean isVerificationPerformed();

    void setVerificationPerformed(boolean verificationPerformed);

    T getVerificationReport();

    void setVerificationReport(T verificationReport);
}
