package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Efs;

import java.util.List;

@Repository
public interface EfsRepository extends JpaRepository<Efs, Long> {
    List<Efs> findByVpcId(Long vpcId);
}
