package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Cidr;

import java.util.List;

@Repository
public interface CidrRepository extends JpaRepository<Cidr, Long> {
	List<Cidr> findByCidrAndEnv(String cidr, String env);
	List<Cidr> findByEnv(String env);
	//List<Cidr> findByIpAndRangeAndEnv(String ip,String range, String env);

}
