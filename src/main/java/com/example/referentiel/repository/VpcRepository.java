package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Vpc;

import java.util.List;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface VpcRepository extends JpaRepository<Vpc, Long> {
    List<Vpc> findByAccountId(Long accountId);
    Vpc findByCidrId(Long cidrId);
}
