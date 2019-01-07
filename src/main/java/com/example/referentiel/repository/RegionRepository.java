package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
}
