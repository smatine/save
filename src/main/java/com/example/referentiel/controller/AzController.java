package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Az;
import com.example.referentiel.model.Region;
import com.example.referentiel.repository.AzRepository;
import com.example.referentiel.repository.RegionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class AzController {

    @Autowired
    private AzRepository azRepository;

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping("/regions/{regionId}/azs")
    public List<Az> getAzsByRegionId(@PathVariable Long regionId) {
        return azRepository.findByRegionId(regionId);
    }

    @GetMapping("/azs")
    Collection<Az> azs() {
    	
        return azRepository.findAll();
    }
    
    @GetMapping("/azs/{id}")
    ResponseEntity<?> getAz(@PathVariable Long id) {
        Optional<Az> az = azRepository.findById(id);
        return az.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/regions/{regionId}/azs")
    public Az addAz(@PathVariable String regionId,
                            @Valid @RequestBody Az az) {
    	
    	long accId = Long.valueOf(regionId);
        return regionRepository.findById(accId)
                .map(region -> {
                	az.setRegion(region);
                    return azRepository.save(az);
                }).orElseThrow(() -> new ResourceNotFoundException("Region not found with id " + regionId));
    }

    @PutMapping("/regions/{regionId}/azs/{azId}")
    public Az updateAz(@PathVariable Long regionId,
                               @PathVariable Long azId,
                               @Valid @RequestBody Az azRequest) {
        if(!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region not found with id " + regionId);
        }
        Optional<Region> region = regionRepository.findById(regionId);
        return azRepository.findById(azId)
                .map(az -> {
                	az.setDescription(azRequest.getDescription());
                	az.setName(azRequest.getName());
                	az.setRegion(region.get());
                	
                    return azRepository.save(az);
                }).orElseThrow(() -> new ResourceNotFoundException("Az not found with id " + azId));
    }

    @DeleteMapping("/regions/{regionId}/azs/{azId}")
    public ResponseEntity<?> deleteAz(@PathVariable Long regionId,
                                          @PathVariable Long azId) {
        if(!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region not found with id " + regionId);
        }

        return azRepository.findById(azId)
                .map(az -> {
                	azRepository.delete(az);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Az not found with id " + azId));

    }
}
