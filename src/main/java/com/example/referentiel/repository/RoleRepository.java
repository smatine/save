package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Role;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findByAccountId(Long accountId);
}
