package com.example.referentiel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Route;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByRouteTableId(Long routeTableId);
}
