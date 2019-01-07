package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.RouteTable;

import java.util.List;

@Repository
public interface RouteTableRepository extends JpaRepository<RouteTable, Long> {
    List<RouteTable> findByVpcId(Long vpcId);
}
