package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.StorageAcl;

import java.util.List;

@Repository
public interface StorageAclRepository extends JpaRepository<StorageAcl, Long> {
    List<StorageAcl> findByStorageId(Long storageId);
}
