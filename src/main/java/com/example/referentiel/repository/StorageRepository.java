package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Storage;

import java.util.List;

@Repository
public interface StorageRepository extends JpaRepository<Storage, Long> {
    List<Storage> findByAccountId(Long storageId);
}
