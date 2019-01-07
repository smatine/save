package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Subnet;

import java.util.List;

@Repository
public interface SubnetRepository extends JpaRepository<Subnet, Long> {
    List<Subnet> findByVpcId(Long vpcId);
}
