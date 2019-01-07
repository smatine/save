package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Rule;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {
    List<Rule> findByNaclId(Long naclId);
}
