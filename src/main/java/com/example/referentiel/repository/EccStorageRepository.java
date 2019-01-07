package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.EccStorage;

import java.util.List;

@Repository
public interface EccStorageRepository extends JpaRepository<EccStorage, Long> {
    List<EccStorage> findByEccId(Long eccId);
    List<EccStorage> findByLaunchConfigurationId(Long launchConfigurationId);
}
