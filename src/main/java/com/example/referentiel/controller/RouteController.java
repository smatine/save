package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Route;
import com.example.referentiel.model.RouteTable;
import com.example.referentiel.repository.RouteRepository;
import com.example.referentiel.repository.RouteTableRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private RouteTableRepository routeTableRepository;
    

    @GetMapping("/routetables/{routetableId}/routes")
    public List<Route> getRulesByRouteTableId(@PathVariable Long routetableId) {
        return routeRepository.findByRouteTableId(routetableId);
    }

    @GetMapping("/routes")
    Collection<Route> routes() {
    	Collection<Route> routes = routeRepository.findAll();  	
        return routes;
    }
    
    @GetMapping("/routes/{id}")
    ResponseEntity<?> getRoute(@PathVariable Long id) {
        Optional<Route> route = routeRepository.findById(id);
        
        return route.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/routetables/{routetableId}/routes")
    public Route addRoute(@PathVariable String routetableId,
                            @Valid @RequestBody Route route) {
    	
    	long accId = Long.valueOf(routetableId);
        return routeTableRepository.findById(accId)
                .map(routeTable -> {
                	
                	route.setRouteTable(routeTable);
                    return routeRepository.save(route);
                }).orElseThrow(() -> new ResourceNotFoundException("RouteTable not found with id " + routetableId));
    }

    @PutMapping("/routetables/{routetableId}/routes/{routeId}")
    public Route updateRoute(@PathVariable Long routetableId,
                               @PathVariable Long routeId,
                               @Valid @RequestBody Route routeRequest) {
        if(!routeTableRepository.existsById(routetableId)) {
            throw new ResourceNotFoundException("RouteTable not found with id " + routetableId);
        }
        Optional<RouteTable> routeTable = routeTableRepository.findById(routetableId);
        
        return routeRepository.findById(routeId)
                .map(route -> {
                	route.setText(routeRequest.getText());
                	
                	route.setDestination(routeRequest.getDestination());
                	route.setPropagation(routeRequest.isPropagation());
                	route.setTarget(routeRequest.getTarget());
                	route.setRouteTable(routeTable.get());
                	
                	route.setPeering(routeRequest.getPeering());
                	route.setEndPoint(routeRequest.getEndPoint());
                	route.setTargetType(routeRequest.getTargetType());
                	
                    return routeRepository.save(route);
                }).orElseThrow(() -> new ResourceNotFoundException("Route not found with id " + routeId));
    }

    @DeleteMapping("/routetables/{routetableId}/routes/{routeId}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long routetableId,
                                          @PathVariable Long routeId) {
        if(!routeTableRepository.existsById(routetableId)) {
            throw new ResourceNotFoundException("RoueTable not found with id " + routetableId);
        }

        return routeRepository.findById(routeId)
                .map(route -> {
                	routeRepository.delete(route);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Route not found with id " + routeId));

    }
}
