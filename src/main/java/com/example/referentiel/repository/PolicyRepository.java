package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Policy;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByAccountId(Long accountId);
}
