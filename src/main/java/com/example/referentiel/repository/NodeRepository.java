package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Node;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {
   // List<Account> findByProductId(Long productId);
    
}
