package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Ami;
import com.example.referentiel.model.Dhcp;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.model.InstanceType;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.AmiRepository;
import com.example.referentiel.repository.EccRepository;
import com.example.referentiel.repository.InstanceTypeRepository;
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
public class EccController {

    @Autowired
    private EccRepository eccRepository;
    /*
    @Autowired
    private AmiRepository amiRepository;
    
    @Autowired
    private InstanceTypeRepository instanceTypeRepository;
    */
    @Autowired
    private SgRepository sgRepository;
    
    
    @GetMapping("/vpcs/{vpcId}/eccs")
    public List<Ecc> getEccsByVpcId(@PathVariable Long vpcId) {
        return eccRepository.findByVpcId(vpcId);
    }
    
    
    @GetMapping("/eccs")
    Collection<Ecc> eccs() {
    	Collection<Ecc> eccs = eccRepository.findAll();
    	
        return eccs;
    }
    
    @GetMapping("/eccs/{id}")
    ResponseEntity<?> getEcc(@PathVariable Long id) {
        Optional<Ecc> ecc = eccRepository.findById(id);
        
        return ecc.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/ecc")
    public Ecc addEcc(@Valid @RequestBody Ecc ecc) {
    	
    	List<Sg> sgss = ecc.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getEccs().add(ecc);
    		sgs.add(ss);
    	}
    	ecc.setSgs(sgs);
    	Ecc ec = eccRepository.save(ecc);
    	
    	Iterator<Sg> itgs = sgs.iterator();
    	while(itgs.hasNext()) {
    		Sg s = (Sg)itgs.next();
    		sgRepository.save(s);
    	}
    	
    	return ec;
    }
    
    @PutMapping("/eccs/{eccId}")
    public Ecc updateEcc(@PathVariable Long eccId,
                               @Valid @RequestBody Ecc eccRequest) {
    	
    	List<Sg> sgss = eccRequest.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getEccs().add(eccRequest);
    		sgs.add(ss);
    	}
    	
        return eccRepository.findById(eccId)
                .map(ecc -> {
                	//autoAssignPublicIp shutdownBehaviour enableTerminationProtection encoded64 instanceType ami
                    //monitoring useData useDataText
                	Iterator<Sg> itsg = ecc.getSgs().iterator();
                	while(itsg.hasNext()) {
                		Sg s = (Sg)itsg.next();
                		s.getEccs().remove(ecc);
                		sgRepository.save(s);
                	}
                	ecc.setName(eccRequest.getName());
                	ecc.setAutoAssignPublicIp(eccRequest.getAutoAssignPublicIp());
                	ecc.setShutdownBehaviour(eccRequest.getShutdownBehaviour());
                	ecc.setEnableTerminationProtection(eccRequest.isEnableTerminationProtection());
                	ecc.setEncoded64(eccRequest.isEncoded64());
                	
                	ecc.setMonitoring(eccRequest.isMonitoring());
                	ecc.setUserData(eccRequest.isUserData());
                	ecc.setUserDataText(eccRequest.getUserDataText());
                	
                	if(eccRequest.getRole() != null) {
                		ecc.setRole(eccRequest.getRole());
                		
                	}
                	else {
                		ecc.setRole(null);
                		
                	}
                	
                	ecc.setAmi(eccRequest.getAmi());
                	ecc.setInstanceType(eccRequest.getInstanceType());
                	ecc.setVpc(eccRequest.getVpc());
                	ecc.setAccount(eccRequest.getAccount());
                	ecc.setSubnet(eccRequest.getSubnet());
                	
                	ecc.setSgs(sgs);
                	
                    return eccRepository.save(ecc);
                }).orElseThrow(() -> new ResourceNotFoundException("Ecc not found with id " + eccId));
    }

    @DeleteMapping("/eccs/{eccId}")
    public ResponseEntity<?> deleteEcc(@PathVariable Long eccId) {

        return eccRepository.findById(eccId)
                .map(ecc -> {               	
                	System.out.println("deleteEcc");
                    /*
                	Ami ami = ecc.getAmi();
                	InstanceType instanceType = ecc.getInstanceType();
                	Vpc vpc = ecc.getVpc();
                	Subnet subnet = ecc.getSubnet();
                	*/
                	eccRepository.delete(ecc);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Ecc not found with id " + eccId));

    }
}
