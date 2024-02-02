package uk.gov.esos.api.workflow.request.core.domain;

public interface RequestTaskPayloadVerifiable {

    boolean isVerificationPerformed();

    void setVerificationPerformed(boolean verificationPerformed);
}
