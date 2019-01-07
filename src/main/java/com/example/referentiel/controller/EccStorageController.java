package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.EccStorage;
import com.example.referentiel.model.LaunchConfiguration;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.repository.EccStorageRepository;
import com.example.referentiel.repository.LaunchConfigurationRepository;
import com.example.referentiel.repository.SubnetRepository;
import com.example.referentiel.repository.EccRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class EccStorageController {

    @Autowired
    private EccStorageRepository eccStorageRepository;

    @Autowired
    private EccRepository eccRepository;
    
    @Autowired
    private LaunchConfigurationRepository launchConfigurationRepository;
    
    @GetMapping("/eccs/{eccId}/eccStorages")
    public List<EccStorage> getEccStoragesByEccId(@PathVariable Long eccId) {
        return eccStorageRepository.findByEccId(eccId);
    }
    
    @GetMapping("/launchConfigurations/{launchConfigurationId}/eccStorages")
    public List<EccStorage> getEccStoragesByLaunchConfigurationId(@PathVariable Long launchConfigurationId) {
        return eccStorageRepository.findByLaunchConfigurationId(launchConfigurationId);
    }

    @GetMapping("/eccStorages")
    Collection<EccStorage> eccStorages() {
    	Collection<EccStorage> eccStorages = eccStorageRepository.findAll();  	
        return eccStorages;
    }
    
    @GetMapping("/eccStorages/{id}")
    ResponseEntity<?> getEccStorage(@PathVariable Long id) {
        Optional<EccStorage> eccStorage = eccStorageRepository.findById(id);
        return eccStorage.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/launchConfigurationStorages/{id}")
    ResponseEntity<?> getLaunchConfigurationStorage(@PathVariable Long id) {
        Optional<EccStorage> eccStorage = eccStorageRepository.findById(id);
        return eccStorage.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/eccs/{eccId}/eccStorages")
    public EccStorage addEccStorage(@PathVariable String eccId,
                            @Valid @RequestBody EccStorage eccStorage) {
    	
    	long accId = Long.valueOf(eccId);
    	
        return eccRepository.findById(accId)
                .map(ecc -> {
                	eccStorage.setEcc(ecc);
                	EccStorage na = eccStorageRepository.save(eccStorage);
                    return na;                	
                }).orElseThrow(() -> new ResourceNotFoundException("Ecc not found with id " + eccId));
    }
    
    @PostMapping("/launchConfigurations/{launchConfigurationId}/launchConfigurationStorages")
    public EccStorage addLaunchConfigurationStorage(@PathVariable String launchConfigurationId,
                            @Valid @RequestBody EccStorage launchConfigurationStorage) {
    	
    	long accId = Long.valueOf(launchConfigurationId);
    	
        return launchConfigurationRepository.findById(accId)
                .map(launchConfiguration -> {
                	launchConfigurationStorage.setLaunchConfiguration(launchConfiguration);
                	EccStorage na = eccStorageRepository.save(launchConfigurationStorage);
                    return na;                	
                }).orElseThrow(() -> new ResourceNotFoundException("launchConfiguration not found with id " + launchConfigurationId));
    }

    @PutMapping("/eccs/{eccId}/eccStorages/{eccStorageId}")
    public EccStorage updateEccStorage(@PathVariable Long eccId,
                               @PathVariable Long eccStorageId,
                               @Valid @RequestBody EccStorage eccStorageRequest) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("Ecc not found with id " + eccId);
        }
        Optional<Ecc> ecc = eccRepository.findById(eccId);
    	
        return eccStorageRepository.findById(eccStorageId)
                .map(eccStorage -> {
                	//volumeType device snapshot size volume iops throughput deleteOnTermination encrypted
                	eccStorage.setVolumeType(eccStorageRequest.getVolumeType());
                	eccStorage.setDevice(eccStorageRequest.getDevice());
                	eccStorage.setSnapshot(eccStorageRequest.getSnapshot());
                	
                	eccStorage.setSize(eccStorageRequest.getSize());
                	eccStorage.setVolume(eccStorageRequest.getVolume());
                	eccStorage.setIops(eccStorageRequest.getIops());
                	eccStorage.setThroughput(eccStorageRequest.getThroughput());
                	eccStorage.setDeleteOnTermination(eccStorageRequest.isDeleteOnTermination());
                	eccStorage.setEncrypted(eccStorageRequest.getEncrypted());
                	
                	eccStorage.setEcc(ecc.get());
                	EccStorage na = eccStorageRepository.save(eccStorage);
                	
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("EccStorage not found with id " + eccStorageId));
    }
    
    @PutMapping("/launchConfigurations/{launchConfigurationId}/launchConfigurationStorages/{launchConfigurationStorageId}")
    public EccStorage updateLaunchConfigurationStorage(@PathVariable Long launchConfigurationId,
                               @PathVariable Long launchConfigurationStorageId,
                               @Valid @RequestBody EccStorage launchConfigurationStorageRequest) {
        if(!launchConfigurationRepository.existsById(launchConfigurationId)) {
            throw new ResourceNotFoundException("launchConfiguration not found with id " + launchConfigurationId);
        }
        Optional<LaunchConfiguration> launchConfiguration = launchConfigurationRepository.findById(launchConfigurationId);
    	
        return eccStorageRepository.findById(launchConfigurationStorageId)
                .map(eccStorage -> {
                	//volumeType device snapshot size volume iops throughput deleteOnTermination encrypted
                	eccStorage.setVolumeType(launchConfigurationStorageRequest.getVolumeType());
                	eccStorage.setDevice(launchConfigurationStorageRequest.getDevice());
                	eccStorage.setSnapshot(launchConfigurationStorageRequest.getSnapshot());
                	
                	eccStorage.setSize(launchConfigurationStorageRequest.getSize());
                	eccStorage.setVolume(launchConfigurationStorageRequest.getVolume());
                	eccStorage.setIops(launchConfigurationStorageRequest.getIops());
                	eccStorage.setThroughput(launchConfigurationStorageRequest.getThroughput());
                	eccStorage.setDeleteOnTermination(launchConfigurationStorageRequest.isDeleteOnTermination());
                	eccStorage.setEncrypted(launchConfigurationStorageRequest.getEncrypted());
                	
                	eccStorage.setLaunchConfiguration(launchConfiguration.get());
                	EccStorage na = eccStorageRepository.save(eccStorage);
                	
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("launchConfigurationStorage not found with id " + launchConfigurationStorageId));
    }
    
    @DeleteMapping("/eccs/{eccId}/eccStorages/{eccStorageId}")
    public ResponseEntity<?> deleteEccStorage(@PathVariable Long eccId,
                                          @PathVariable Long eccStorageId) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("Ecc not found with id " + eccId);
        }

        return eccStorageRepository.findById(eccStorageId)
                .map(eccStorage -> {
                	eccStorageRepository.delete(eccStorage);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("EccStorage not found with id " + eccStorageId));

    }
    
    @DeleteMapping("/launchConfigurations/{launchConfigurationId}/launchConfigurationStorages/{launchConfigurationStorageId}")
    public ResponseEntity<?> deleteLaunchConfigurationStorage(@PathVariable Long launchConfigurationId,
                                          @PathVariable Long launchConfigurationStorageId) {
        if(!launchConfigurationRepository.existsById(launchConfigurationId)) {
            throw new ResourceNotFoundException("launchConfiguration not found with id " + launchConfigurationId);
        }

        return eccStorageRepository.findById(launchConfigurationStorageId)
                .map(eccStorage -> {
                	eccStorageRepository.delete(eccStorage);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("EccStorage not found with id " + launchConfigurationStorageId));

    }
    
}
