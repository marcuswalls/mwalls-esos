package uk.gov.esos.api.verificationbody.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.verificationbody.enumeration.VerificationBodyStatus;
import uk.gov.esos.api.verificationbody.repository.VerificationBodyRepository;

@Service
@RequiredArgsConstructor
public class VerificationBodyManagementService {

    private final VerificationBodyRepository verificationBodyRepository;

    public void activateVerificationBody(Long verificationBodyId) {
       verificationBodyRepository.findByIdAndStatus(verificationBodyId, VerificationBodyStatus.PENDING)
            .ifPresent(vb -> vb.setStatus(VerificationBodyStatus.ACTIVE));
    }
}
