package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Az;

import java.util.List;

@Repository
public interface AzRepository extends JpaRepository<Az, Long> {
    List<Az> findByRegionId(Long regionId);
}
