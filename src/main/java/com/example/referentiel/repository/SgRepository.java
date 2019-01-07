package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Sg;

import java.util.List;

@Repository
public interface SgRepository extends JpaRepository<Sg, Long> {
    List<Sg> findByVpcId(Long vpcId);
}
