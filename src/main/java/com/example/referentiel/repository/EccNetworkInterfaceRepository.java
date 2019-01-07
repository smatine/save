package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.EccNetworkInterface;

import java.util.List;

@Repository
public interface EccNetworkInterfaceRepository extends JpaRepository<EccNetworkInterface, Long> {
    List<EccNetworkInterface> findByEccId(Long eccId);
}
