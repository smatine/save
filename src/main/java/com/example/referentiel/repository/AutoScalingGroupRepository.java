package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.AutoScalingGroup;

import java.util.List;

@Repository
public interface AutoScalingGroupRepository extends JpaRepository<AutoScalingGroup, Long> {
    List<AutoScalingGroup> findByVpcId(Long vpcId);
}
