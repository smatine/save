package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Trigramme;

@Repository
public interface TrigrammeRepository extends JpaRepository<Trigramme, Long> {
}
