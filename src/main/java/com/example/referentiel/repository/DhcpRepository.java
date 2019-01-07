package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Dhcp;

import java.util.List;

@Repository
public interface DhcpRepository extends JpaRepository<Dhcp, Long> {
    List<Dhcp> findByVpcId(Long vpcId);
}
