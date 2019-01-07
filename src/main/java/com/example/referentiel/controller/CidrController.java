package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Cidr;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.CidrRepository;
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
public class CidrController {

    @Autowired
    private CidrRepository cidrRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    @GetMapping("/cidrs")
    Collection<Cidr> cidrs() {
    	Collection<Cidr> cidrs = cidrRepository.findAll();
    	
    	/*Iterator its = cidrs.iterator();
    	while(its.hasNext())
    	{
    		Cidr ci = (Cidr)its.next();
    		if(ci.getVpc() != null) {
    			System.out.println(" vpc=" + ci.getVpc().getId() + ci.getVpc().getText());
    		}
    	}*/
    	
        return cidrs;
    }
    
    @GetMapping("/cidrs/{id}")
    ResponseEntity<?> getCidr(@PathVariable Long id) {
        Optional<Cidr> cidr = cidrRepository.findById(id);
        
        System.out.println("cidr:" +  cidr.toString());
        
        return cidr.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    

    @GetMapping("/cidr/env/{env}")
    public List<Cidr> getCidrsByEnv(@PathVariable String env) {
    	List<Cidr> cidrs = cidrRepository.findByEnv(env);
    	List<Cidr> cidrss = new ArrayList<Cidr>();
    	for(int i = 0; i < cidrs.size(); i++) {
    		if(cidrs.get(i).getVpc() == null ) cidrss.add(cidrs.get(i));
    	}
        return cidrss;
    }
    
    @GetMapping("/cidr/{cidr}/env/{env}/cidrId/{cidrId}")
    public List<Cidr> getCidrsByCidrAndEnv(@PathVariable String cidr, 
    		@PathVariable String env,
    		@PathVariable String cidrId) {
    	
    	cidr = cidr.replace('@', '/');
    	List<Cidr> cidrs = cidrRepository.findByCidrAndEnv(cidr, env);
    	
    	if(!cidrId.equals("0")) {
    		Long l = Long.valueOf(cidrId);
    		Optional<Cidr> ci = cidrRepository.findById(l);
    		Cidr cii = ci.get();
    		if(cidrs.contains(cii) && cii.getEnv().equals(env)) {
    			cidrs.remove(cii);
    		}
    	}
        return cidrs;
    }

    @PostMapping("/cidr")
    public Cidr addCidr(@Valid @RequestBody Cidr cidr) {
    	return cidrRepository.save(cidr);
    }
    
    @PutMapping("/cidrs/{cidrId}")
    public Cidr updateSubnet(@PathVariable Long cidrId,
                               @Valid @RequestBody Cidr cidrRequest) {
    	
    	//System.out.println(" cidrRequest=" + cidrRequest.getVpc().getId() + cidrRequest.getVpc().getText());
    	System.out.println(" cidrRequest=" + cidrRequest.getId() + " env=" + cidrRequest.getEnv() + " text=" + cidrRequest.getText());

    	Optional<Region> region = regionRepository.findById(cidrRequest.getRegion().getId());
    	
        return cidrRepository.findById(cidrId)
                .map(cidr -> {
                	cidr.setText(cidrRequest.getText());
                	cidr.setEnv(cidrRequest.getEnv());
                	/*
                	cidr.setIp(cidrRequest.getIp());
                	cidr.setRange(cidrRequest.getRange());
                    */
                	cidr.setRegion(region.get());
                	cidr.setCidr(cidrRequest.getCidr());
                    return cidrRepository.save(cidr);
                }).orElseThrow(() -> new ResourceNotFoundException("Cidr not found with id " + cidrId));
    }

    @DeleteMapping("/cidrs/{cidrId}")
    public ResponseEntity<?> deleteCidr(@PathVariable Long cidrId) {

        return cidrRepository.findById(cidrId)
                .map(cidr -> {
                	
                	Region region = cidr.getRegion();
                	region.getCidrs().remove(cidr);
                	regionRepository.save(region);
                	
                	cidrRepository.delete(cidr);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Cidr not found with id " + cidrId));

    }
}
