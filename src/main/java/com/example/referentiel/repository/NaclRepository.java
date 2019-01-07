package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Nacl;

import java.util.List;

@Repository
public interface NaclRepository extends JpaRepository<Nacl, Long> {
    List<Nacl> findByVpcId(Long vpcId);
}
