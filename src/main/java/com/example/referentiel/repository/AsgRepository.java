package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Asg;

import java.util.List;

import javax.transaction.Transactional;

@Repository
@Transactional
public interface AsgRepository extends JpaRepository<Asg, Long> {
    List<Asg> findByProductId(Long productId);
}
