package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.InstanceType;

import java.util.List;

@Repository
public interface InstanceTypeRepository extends JpaRepository<InstanceType, Long> {
    
}
