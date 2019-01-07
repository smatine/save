package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.DynamoDb;

import java.util.List;

@Repository
public interface DynamoDbRepository extends JpaRepository<DynamoDb, Long> {
    List<DynamoDb> findByAccountId(Long dynamoDbId);
}
