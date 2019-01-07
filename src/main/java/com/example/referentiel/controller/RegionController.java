package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Region;
import com.example.referentiel.repository.RegionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

import javax.validation.Valid;

@RestController
public class RegionController {

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping("/regions")
    Collection<Region> getRegions() {
        return regionRepository.findAll();
    }

    @GetMapping("/regions/{id}")
    ResponseEntity<?> getRegion(@PathVariable Long id) {
        Optional<Region> group = regionRepository.findById(id);
        return group.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/regions")
    public Region createRegion(@Valid @RequestBody Region region) {
        return regionRepository.save(region);
    }

    @PutMapping("/regions/{regionId}")
    public Region updateRegion(@PathVariable Long regionId,
                                   @Valid @RequestBody Region regionRequest) {
        return regionRepository.findById(regionId)
                .map(region -> {
                	region.setName(regionRequest.getName());
                	region.setDescription(regionRequest.getDescription());
                    return regionRepository.save(region);
                }).orElseThrow(() -> new ResourceNotFoundException("Region not found with id " + regionId));
    }


    @DeleteMapping("/regions/{regionId}")
    public ResponseEntity<?> deleteRegion(@PathVariable Long regionId) {
        return regionRepository.findById(regionId)
                .map(region -> {
                	regionRepository.delete(region);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Region not found with id " + regionId));
    }
}
