package com.gitinsight.repository;

import com.gitinsight.model.SavedCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<SavedCandidate, Long> {
    Optional<SavedCandidate> findByUsername(String username);
}