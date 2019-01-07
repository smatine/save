package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Cidr;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.SubnetCidr;
import com.example.referentiel.repository.CidrRepository;
import com.example.referentiel.repository.SubnetCidrRepository;
import com.example.referentiel.repository.SubnetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class SubnetCidrController {

    @Autowired
    private CidrRepository cidrRepository;

    @Autowired
    private SubnetCidrRepository subnetCidrRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;

    @GetMapping("/cidrs/{cidrId}/subnetcidrs")
    public List<SubnetCidr> getSubnetCidrsByCidrId(@PathVariable Long cidrId) {
        return subnetCidrRepository.findByCidrId(cidrId);
    }
    
    @GetMapping("/cidrs/{cidrId}/subnetcidrs/{subnetCidrId}")
    public List<SubnetCidr> getSubnetCidrsByCidrIdAndNotUse(@PathVariable String cidrId,
    		@PathVariable String subnetCidrId) {    	
    	Long lcidrId = Long.valueOf(cidrId);
    	Long lsubnetCidrId = Long.valueOf(subnetCidrId);
    	
    	List<SubnetCidr> l = subnetCidrRepository.findByCidrId(lcidrId);
    	List<SubnetCidr> ll = new ArrayList<>();
    	for(int i = 0; i< l.size();i++) {
    		SubnetCidr sc = l.get(i);
    		
    		if(sc.getSubnet() == null || sc.getSubnet().getId().longValue() == lsubnetCidrId.longValue()) {
    			ll.add(sc);
    		}
    	}
        return ll;
    }
    
    @GetMapping("/subnetcidrs")
    Collection<SubnetCidr> subnetCidrs() {
    	
        return subnetCidrRepository.findAll();
    }
    
    @GetMapping("/subnetcidrs/{id}")
    ResponseEntity<?> getSubnetCidr(@PathVariable Long id) {
        Optional<SubnetCidr> subnetCidr = subnetCidrRepository.findById(id);
        
        //System.out.println("subnet:" +  subnetCidr.toString());
        
        return subnetCidr.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
/*
    @PostMapping("/vpcs/{vpcId}/subnets")
    public Subnet addSubnet(@PathVariable Long vpcId,
                            @Valid @RequestBody Subnet subnet) {
        return vpcRepository.findById(vpcId)
                .map(vpc -> {
                    subnet.setVpc(vpc);
                    return subnetRepository.save(subnet);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }
*/
    @PostMapping("/cidrs/{cidrId}/subnetcidrs")
    public SubnetCidr addSubnetCidr(@PathVariable String cidrId,
                            @Valid @RequestBody SubnetCidr subnetCidr) {
    	
    	long cId = Long.valueOf(cidrId);
        return cidrRepository.findById(cId)
                .map(cidr -> {
                	List<SubnetCidr> sCidrs = subnetCidrRepository.findBySubnetCidrAndCidr(subnetCidr.getSubnetCidr(), cidr);
                    for(int i =0; i < sCidrs.size(); i++) {
                    	SubnetCidr sd = sCidrs.get(i);
                    	if(sd.getSubnetCidr().equalsIgnoreCase(subnetCidr.getSubnetCidr())) 
                    	{
                    		System.out.println("existe deja");
                    		throw new ResourceNotFoundException("Subnet existe " + subnetCidr.getSubnetCidr());
                    	}
                    }
                    subnetCidr.setCidr(cidr);
                    return subnetCidrRepository.save(subnetCidr);
                }).orElseThrow(() -> new ResourceNotFoundException("Cidr not found with id " + cidrId));
    }
    
    @PutMapping("/cidrs/{cidrId}/subnetcidrs/{subnetCidrId}/subnet/{subnetId}")
    public SubnetCidr updateSubnetCidr(@PathVariable Long cidrId,
                               @PathVariable Long subnetCidrId,
                               @PathVariable Long subnetId,
                               @Valid @RequestBody SubnetCidr subnetCidrRequest) {
        if(!cidrRepository.existsById(cidrId)) {
            throw new ResourceNotFoundException("Cidr not found with id " + cidrId);
        }
        Optional<Cidr> ci = cidrRepository.findById(cidrId);//getOne(cidrId);
        //System.out.println("0000");
        
        List<SubnetCidr> sCidrs = subnetCidrRepository.findBySubnetCidrAndCidr(subnetCidrRequest.getSubnetCidr(), ci.get());
        for(int i =0; i < sCidrs.size(); i++) {
        	//System.out.println("0001");
        	SubnetCidr sd = sCidrs.get(i);
        	if(sd.getSubnetCidr().equalsIgnoreCase(subnetCidrRequest.getSubnetCidr()) &&
        			sd.getId().longValue() != subnetCidrId.longValue()) 
        	{
        		System.out.println("existe deja " + sd.getId() + " " + subnetCidrId);
        		throw new ResourceNotFoundException("Subnet existe " + subnetCidrRequest.getSubnetCidr());
        		
        	}
        }
        //System.out.println("0002");
        
        return subnetCidrRepository.findById(subnetCidrId)
                .map(subnetCidr -> {
                	//System.out.println("0003");
                	subnetCidr.setText(subnetCidrRequest.getText());
                	subnetCidr.setSubnetCidr(subnetCidrRequest.getSubnetCidr());
                	if(subnetId.longValue() != 0) {
                		Optional<Subnet> subnet = subnetRepository.findById(subnetId);
                		subnetCidr.setSubnet(subnet.get());
                	}
                	//System.out.println("0004");
                    return subnetCidrRepository.save(subnetCidr);
                }).orElseThrow(() -> new ResourceNotFoundException("SubnetCidr not found with id " + subnetCidrId));
    }

    @DeleteMapping("/cidrs/{cidrId}/subnetcidrs/{subnetCidrId}")
    public ResponseEntity<?> deleteSubnetCidr(@PathVariable Long cidrId,
                                          @PathVariable Long subnetCidrId) {
    	
    	//System.out.println("subnet2222:" +  cidrId.toString() +  "  " + subnetCidrId.toString());
        if(!cidrRepository.existsById(cidrId)) {
            throw new ResourceNotFoundException("Cidr not found with id " + cidrId);
        }

        return subnetCidrRepository.findById(subnetCidrId)
                .map(subnetCidr -> {
                    subnetCidrRepository.delete(subnetCidr);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("SubnetCidr not found with id " + subnetCidrId));

    }
}
