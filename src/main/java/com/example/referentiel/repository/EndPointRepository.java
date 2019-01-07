package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.EndPoint;

import java.util.List;

@Repository
public interface EndPointRepository extends JpaRepository<EndPoint, Long> {
    List<EndPoint> findByVpcId(Long vpcId);
}
