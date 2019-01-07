package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.EccNetworkInterface;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.repository.EccNetworkInterfaceRepository;
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
public class EccNetworkInterfaceController {

    @Autowired
    private EccNetworkInterfaceRepository eccNetworkInterfaceRepository;

    @Autowired
    private EccRepository eccRepository;

    @GetMapping("/eccs/{eccId}/eccNetworkInterfaces")
    public List<EccNetworkInterface> getEccNetworkInterfacesByEccId(@PathVariable Long eccId) {
        return eccNetworkInterfaceRepository.findByEccId(eccId);
    }

    @GetMapping("/eccNetworkInterfaces")
    Collection<EccNetworkInterface> eccNetworkInterfaces() {
    	Collection<EccNetworkInterface> eccNetworkInterfaces = eccNetworkInterfaceRepository.findAll();  	
        return eccNetworkInterfaces;
    }
    
    @GetMapping("/eccNetworkInterfaces/{id}")
    ResponseEntity<?> getEccNetworkInterface(@PathVariable Long id) {
        Optional<EccNetworkInterface> eccNetworkInterface = eccNetworkInterfaceRepository.findById(id);
        return eccNetworkInterface.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/eccs/{eccId}/eccNetworkInterfaces")
    public EccNetworkInterface addEccNetworkInterface(@PathVariable String eccId,
                            @Valid @RequestBody EccNetworkInterface eccNetworkInterface) {
    	
    	long accId = Long.valueOf(eccId);
    	
        return eccRepository.findById(accId)
                .map(ecc -> {
                	
                	
                	eccNetworkInterface.setEcc(ecc);
                	
                	EccNetworkInterface na = eccNetworkInterfaceRepository.save(eccNetworkInterface);
                    return na;
                	
                }).orElseThrow(() -> new ResourceNotFoundException("Ecc not found with id " + eccId));
    }

    @PutMapping("/eccs/{eccId}/eccNetworkInterfaces/{eccNetworkInterfaceId}")
    public EccNetworkInterface updateEccNetworkInterface(@PathVariable Long eccId,
                               @PathVariable Long eccNetworkInterfaceId,
                               @Valid @RequestBody EccNetworkInterface eccNetworkInterfaceRequest) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("Ecc not found with id " + eccId);
        }
        Optional<Ecc> ecc = eccRepository.findById(eccId);
    	
        return eccNetworkInterfaceRepository.findById(eccNetworkInterfaceId)
                .map(eccNetworkInterface -> {
                	//device networkInterface primaryIp secondaryIp ipv6Ips
                	//Device NetworkInterface PrimaryIp SecondaryIp Ipv6Ips
                	eccNetworkInterface.setDevice(eccNetworkInterfaceRequest.getDevice());
                	eccNetworkInterface.setNetworkInterface(eccNetworkInterfaceRequest.getNetworkInterface());
                	eccNetworkInterface.setPrimaryIp(eccNetworkInterfaceRequest.getPrimaryIp());
                	
                	eccNetworkInterface.setSecondaryIp(eccNetworkInterfaceRequest.getSecondaryIp());
                	eccNetworkInterface.setIpv6Ips(eccNetworkInterfaceRequest.getIpv6Ips());
                	
                	
                	eccNetworkInterface.setEcc(ecc.get());
                	EccNetworkInterface na = eccNetworkInterfaceRepository.save(eccNetworkInterface);
                	
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("EccNetworkInterface not found with id " + eccNetworkInterfaceId));
    }

    @DeleteMapping("/eccs/{eccId}/eccNetworkInterfaces/{eccNetworkInterfaceId}")
    public ResponseEntity<?> deleteEccNetworkInterface(@PathVariable Long eccId,
                                          @PathVariable Long eccNetworkInterfaceId) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("Ecc not found with id " + eccId);
        }

        return eccNetworkInterfaceRepository.findById(eccNetworkInterfaceId)
                .map(eccNetworkInterface -> {
                	eccNetworkInterfaceRepository.delete(eccNetworkInterface);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("EccNetworkInterface not found with id " + eccNetworkInterfaceId));

    }
}
