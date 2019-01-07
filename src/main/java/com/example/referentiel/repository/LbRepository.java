package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Lb;

import java.util.List;

@Repository
public interface LbRepository extends JpaRepository<Lb, Long> {
    List<Lb> findByVpcId(Long vpcId);
}
