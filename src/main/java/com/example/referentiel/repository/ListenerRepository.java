package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Listener;

import java.util.List;

@Repository
public interface ListenerRepository extends JpaRepository<Listener, Long> {
    List<Listener> findByLbId(Long lbId);
}
