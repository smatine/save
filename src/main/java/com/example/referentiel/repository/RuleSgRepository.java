package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.RuleSg;

import java.util.List;

@Repository
public interface RuleSgRepository extends JpaRepository<RuleSg, Long> {
    List<RuleSg> findBySgId(Long sgId);
}
