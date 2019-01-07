package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.InstanceType;
import com.example.referentiel.repository.InstanceTypeRepository;
import com.example.referentiel.repository.RegionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
public class InstanceTypeController {

    @Autowired
    private InstanceTypeRepository instanceTypeRepository;
    
    
    @GetMapping("/instanceTypes")
    Collection<InstanceType> instanceTypes() {
    	Collection<InstanceType> instanceTypes = instanceTypeRepository.findAll();
        return instanceTypes;
    }
    
    @GetMapping("/instanceTypes/{id}")
    ResponseEntity<?> getInstanceType(@PathVariable Long id) {
        Optional<InstanceType> instanceType = instanceTypeRepository.findById(id);
        
        return instanceType.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/instanceType")
    public InstanceType addInstanceType(@Valid @RequestBody InstanceType instanceType) {
    	return instanceTypeRepository.save(instanceType);
    }
    
    @PutMapping("/instanceTypes/{instanceTypeId}")
    public InstanceType updateSubnet(@PathVariable Long instanceTypeId,
                               @Valid @RequestBody InstanceType instanceTypeRequest) {
    	
    	
        return instanceTypeRepository.findById(instanceTypeId)
                .map(instanceType -> {
                	      
                	instanceType.setFamily(instanceTypeRequest.getFamily());
                	instanceType.setType(instanceTypeRequest.getType());
                	instanceType.setVcpus(instanceTypeRequest.getVcpus());
                	
                	instanceType.setMemory(instanceTypeRequest.getMemory());
                	instanceType.setInstanceStorage(instanceTypeRequest.getInstanceStorage());
                	instanceType.setEbsOptimized(instanceTypeRequest.isEbsOptimized());
                	instanceType.setNetworkPerformance(instanceTypeRequest.getNetworkPerformance());
                	
                	
                	
                    return instanceTypeRepository.save(instanceType);
                }).orElseThrow(() -> new ResourceNotFoundException("InstanceType not found with id " + instanceTypeId));
    }

    @DeleteMapping("/instanceTypes/{instanceTypeId}")
    public ResponseEntity<?> deleteInstanceType(@PathVariable Long instanceTypeId) {

        return instanceTypeRepository.findById(instanceTypeId)
                .map(instanceType -> {               	
                	
                	instanceTypeRepository.delete(instanceType);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("InstanceType not found with id " + instanceTypeId));

    }
}
