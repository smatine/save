package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.LaunchConfiguration;

import java.util.List;

@Repository
public interface LaunchConfigurationRepository extends JpaRepository<LaunchConfiguration, Long> {
    List<LaunchConfiguration> findByVpcId(Long vpcId);
}
