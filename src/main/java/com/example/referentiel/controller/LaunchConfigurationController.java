package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Ami;
import com.example.referentiel.model.LaunchConfiguration;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.InstanceType;
import com.example.referentiel.model.Sg;
import com.example.referentiel.repository.LaunchConfigurationRepository;
import com.example.referentiel.repository.SgRepository;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
public class LaunchConfigurationController {

    @Autowired
    private LaunchConfigurationRepository launchConfigurationRepository;
   
    @Autowired
    private SgRepository sgRepository;
    
    @GetMapping("/vpcs/{vpcId}/launchConfigurations")
    public List<LaunchConfiguration> getLaunchConfigurationsByVpcId(@PathVariable Long vpcId) {
        return launchConfigurationRepository.findByVpcId(vpcId);
    }
    
    @GetMapping("/launchConfigurations")
    Collection<LaunchConfiguration> launchConfigurations() {
    	Collection<LaunchConfiguration> launchConfigurations = launchConfigurationRepository.findAll();
    	
        return launchConfigurations;
    }
    
    @GetMapping("/launchConfigurations/{id}")
    ResponseEntity<?> getLaunchConfiguration(@PathVariable Long id) {
        Optional<LaunchConfiguration> launchConfiguration = launchConfigurationRepository.findById(id);
        
        return launchConfiguration.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/launchConfiguration")
    public LaunchConfiguration addLaunchConfiguration(@Valid @RequestBody LaunchConfiguration launchConfiguration) {
    	
    	List<Sg> sgss = launchConfiguration.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getLaunchConfigurations().add(launchConfiguration);
    		sgs.add(ss);
    	}
    	launchConfiguration.setSgs(sgs);
    	LaunchConfiguration ec = launchConfigurationRepository.save(launchConfiguration);
    	
    	Iterator<Sg> itgs = sgs.iterator();
    	while(itgs.hasNext()) {
    		Sg s = (Sg)itgs.next();
    		sgRepository.save(s);
    	}
    	
    	return ec;
    }
    
    @PutMapping("/launchConfigurations/{launchConfigurationId}")
    public LaunchConfiguration updateLaunchConfiguration(@PathVariable Long launchConfigurationId,
                               @Valid @RequestBody LaunchConfiguration launchConfigurationRequest) {
    	
    	List<Sg> sgss = launchConfigurationRequest.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getLaunchConfigurations().add(launchConfigurationRequest);
    		sgs.add(ss);
    	}
    	
        return launchConfigurationRepository.findById(launchConfigurationId)
                .map(launchConfiguration -> {
                	//name, kernalId, ramDiskId, purchasingOption, iamRole, ipAddressType,
                	//monitoring, userData, encoded64, userDataText
                	
                	Iterator<Sg> itsg = launchConfiguration.getSgs().iterator();
                	while(itsg.hasNext()) {
                		Sg s = (Sg)itsg.next();
                		s.getLaunchConfigurations().remove(launchConfiguration);
                		sgRepository.save(s);
                	}
                	launchConfiguration.setName(launchConfigurationRequest.getName());
                	
                	launchConfiguration.setKernalId(launchConfigurationRequest.getKernalId());
                	launchConfiguration.setRamDiskId(launchConfigurationRequest.getRamDiskId());
                	launchConfiguration.setPurchasingOption(launchConfigurationRequest.isPurchasingOption());
                	launchConfiguration.setIamRole(launchConfigurationRequest.getIamRole());
                	launchConfiguration.setIpAddressType(launchConfigurationRequest.getIpAddressType());
                	
                	
                	launchConfiguration.setEncoded64(launchConfigurationRequest.isEncoded64());
                	launchConfiguration.setMonitoring(launchConfigurationRequest.isMonitoring());
                	launchConfiguration.setUserData(launchConfigurationRequest.isUserData());
                	launchConfiguration.setUserDataText(launchConfigurationRequest.getUserDataText());
                	
                	launchConfiguration.setAmi(launchConfigurationRequest.getAmi());
                	launchConfiguration.setInstanceType(launchConfigurationRequest.getInstanceType());
                	launchConfiguration.setSgs(sgs);
                	
                	launchConfiguration.setVpc(launchConfigurationRequest.getVpc());
                	launchConfiguration.setAccount(launchConfigurationRequest.getAccount());
                	
                    return launchConfigurationRepository.save(launchConfiguration);
                }).orElseThrow(() -> new ResourceNotFoundException("LaunchConfiguration not found with id " + launchConfigurationId));
    }

    @DeleteMapping("/launchConfigurations/{launchConfigurationId}")
    public ResponseEntity<?> deleteLaunchConfiguration(@PathVariable Long launchConfigurationId) {

        return launchConfigurationRepository.findById(launchConfigurationId)
                .map(launchConfiguration -> {               	
                	System.out.println("deleteLaunchConfiguration");
                   
                	launchConfigurationRepository.delete(launchConfiguration);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("LaunchConfiguration not found with id " + launchConfigurationId));

    }
}
