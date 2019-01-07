package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Peering;

import java.util.List;

@Repository
public interface PeeringRepository extends JpaRepository<Peering, Long> {
	List<Peering> findByVpcId(Long vpcId);
	List<Peering> findByVpcIdAndType(Long vpcId, String type);
}
