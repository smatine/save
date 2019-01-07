package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.ElasticCache;

import java.util.List;

@Repository
public interface ElasticCacheRepository extends JpaRepository<ElasticCache, Long> {
    List<ElasticCache> findByVpcId(Long vpcId);
}
