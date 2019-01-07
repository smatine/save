package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.TargetGroup;

import java.util.List;

@Repository
public interface TargetGroupRepository extends JpaRepository<TargetGroup, Long> {
    List<TargetGroup> findByVpcId(Long vpcId);
}
