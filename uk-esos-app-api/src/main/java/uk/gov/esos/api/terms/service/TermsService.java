package uk.gov.esos.api.terms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.terms.domain.Terms;
import uk.gov.esos.api.terms.repository.TermsRepository;

@Service
@RequiredArgsConstructor
public class TermsService {

    private final TermsRepository termsRepository;

    public Terms getLatestTerms() {
        return termsRepository.findLatestTerms();
    }

}
