package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Ami;

import java.util.List;

@Repository
public interface AmiRepository extends JpaRepository<Ami, Long> {
    List<Ami> findByRegionId(Long regionId);
}
