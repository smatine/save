package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Cidr;
import com.example.referentiel.model.SubnetCidr;

import java.util.List;

@Repository
public interface SubnetCidrRepository extends JpaRepository<SubnetCidr, Long> {
    List<SubnetCidr> findByCidrId(Long cidrId);
    List<SubnetCidr> findBySubnetCidrAndCidr(String subnetCidr, Cidr cidr);

}
