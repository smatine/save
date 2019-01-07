package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.ElasticSearch;

import java.util.List;

@Repository
public interface ElasticSearchRepository extends JpaRepository<ElasticSearch, Long> {
    List<ElasticSearch> findByVpcId(Long vpcId);
}
