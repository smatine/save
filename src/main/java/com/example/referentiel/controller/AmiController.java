package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Ami;
import com.example.referentiel.model.Region;
import com.example.referentiel.repository.AmiRepository;
import com.example.referentiel.repository.RegionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class AmiController {

    @Autowired
    private AmiRepository amiRepository;

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping("/regions/{regionId}/amis")
    public List<Ami> getAmisByRegionId(@PathVariable Long regionId) {
        return amiRepository.findByRegionId(regionId);
    }

    @GetMapping("/amis")
    Collection<Ami> amis() {
    	
        return amiRepository.findAll();
    }
    
    @GetMapping("/amis/{id}")
    ResponseEntity<?> getAmi(@PathVariable Long id) {
        Optional<Ami> ami = amiRepository.findById(id);
        return ami.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/regions/{regionId}/amis")
    public Ami addAmi(@PathVariable String regionId,
                            @Valid @RequestBody Ami ami) {
    	
    	long accId = Long.valueOf(regionId);
        return regionRepository.findById(accId)
                .map(region -> {
                	ami.setRegion(region);
                    return amiRepository.save(ami);
                }).orElseThrow(() -> new ResourceNotFoundException("Region not found with id " + regionId));
    }

    @PutMapping("/regions/{regionId}/amis/{amiId}")
    public Ami updateAmi(@PathVariable Long regionId,
                               @PathVariable Long amiId,
                               @Valid @RequestBody Ami amiRequest) {
        if(!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region not found with id " + regionId);
        }
        Optional<Region> region = regionRepository.findById(regionId);
        return amiRepository.findById(amiId)
                .map(ami -> {
                	ami.setAmiId(amiRequest.getAmiId());
                	ami.setName(amiRequest.getName());
                	ami.setText(amiRequest.getText());
                	ami.setRegion(region.get());
                	
                    return amiRepository.save(ami);
                }).orElseThrow(() -> new ResourceNotFoundException("Ami not found with id " + amiId));
    }

    @DeleteMapping("/regions/{regionId}/amis/{amiId}")
    public ResponseEntity<?> deleteAmi(@PathVariable Long regionId,
                                          @PathVariable Long amiId) {
        if(!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region not found with id " + regionId);
        }
        //Optional<Region> region = regionRepository.findById(regionId);
        return amiRepository.findById(amiId)
                .map(ami -> {
                	//region.get().getAmis().remove(ami);
                	//regionRepository.save(region.get());
                	amiRepository.delete(ami);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Ami not found with id " + amiId));

    }
}
