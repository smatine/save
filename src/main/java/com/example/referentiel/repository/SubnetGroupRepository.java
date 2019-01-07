package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.SubnetGroup;

import java.util.List;

@Repository
public interface SubnetGroupRepository extends JpaRepository<SubnetGroup, Long> {
    List<SubnetGroup> findByVpcId(Long vpcId);
    List<SubnetGroup> findByVpcIdAndType(Long vpcId, String type);
    
}
