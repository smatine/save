package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Cognito;

import java.util.List;

@Repository
public interface CognitoRepository extends JpaRepository<Cognito, Long> {
    List<Cognito> findByAccountId(Long cognitoId);
}
