package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Account;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByTrigrammeId(Long trigrammeId);
    
    //@EntityGraph(attributePaths = "trigramme")
    //List<Account> findAll();
}
