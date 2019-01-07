package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Peering;
import com.example.referentiel.model.PeeringAccepterExternal;
import com.example.referentiel.model.PeeringAccepterInternal;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.PeeringAccepterExternalRepository;
import com.example.referentiel.repository.PeeringAccepterInternalRepository;
import com.example.referentiel.repository.PeeringRepository;
import com.example.referentiel.repository.RegionRepository;
import com.example.referentiel.repository.VpcRepository;

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
public class PeeringController {

	@Autowired
    private VpcRepository vpcRepository;
	
    @Autowired
    private PeeringRepository peeringRepository;
    
    @Autowired
    private PeeringAccepterExternalRepository peeringAccepterExternalRepository;
    
    @Autowired
    private PeeringAccepterInternalRepository peeringAccepterInternalRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    @GetMapping("/vpcs/{vpcId}/peerings")
    public List<Peering> getPeeringsByVpcId(@PathVariable Long vpcId) {
        return peeringRepository.findByVpcId(vpcId);
    }
    
    @GetMapping("/vpcs/{vpcId}/type/{type}/peerings")
    public List<Peering> getPeeringsByVpcIdAndType(@PathVariable Long vpcId,
    										@PathVariable String type) {
        return peeringRepository.findByVpcIdAndType(vpcId, type);
    }
    
    @GetMapping("/peerings")
    Collection<Peering> peerings() {
    	Collection<Peering> peerings = peeringRepository.findAll();
    	
        return peerings;
    }
    
    @GetMapping("/peerings/{id}")
    ResponseEntity<?> getPeering(@PathVariable Long id) {
        Optional<Peering> peering = peeringRepository.findById(id);
                
        return peering.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    
    @PostMapping("/vpcs/{vpcId}/peerings")
    public Peering addPeering(@PathVariable Long vpcId, @Valid @RequestBody Peering peering) {
    	
    	if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
    	if(peering.getType().equals("External"))
    	{
    		PeeringAccepterExternal peeringAccepterExternal = new PeeringAccepterExternal();
    		
    		Optional<Region> region = regionRepository.findById(peering.getPeeringAccepterExternal().getRegion().getId());
    		peeringAccepterExternal.setOwner(peering.getPeeringAccepterExternal().getOwner());
   		 	peeringAccepterExternal.setVpcId(peering.getPeeringAccepterExternal().getVpcId());
   		 	peeringAccepterExternal.setRegion(region.get());
   		 	
   		 	peeringAccepterExternal.setPeering(peering);
   		 	peering.setPeeringAccepterExternal(peeringAccepterExternal);
   		 	peeringAccepterExternal = peeringAccepterExternalRepository.save(peeringAccepterExternal);
    	}
    	else
    	{
    		//System.out.println("getPeeringAccepterInternal().getVpc()=" + peering.getPeeringAccepterInternal().getVpc().getId());
    		PeeringAccepterInternal peeringAccepterInternal = new PeeringAccepterInternal();
    		
    		Optional<Vpc> vpc = vpcRepository.findById(peering.getPeeringAccepterInternal().getVpc().getId());
    		
   		 	peeringAccepterInternal.setVpc(vpc.get());
   		 	peeringAccepterInternal.setPeering(peering);
   		 	peering.setPeeringAccepterInternal(peeringAccepterInternal);
   		 	peeringAccepterInternal = peeringAccepterInternalRepository.save(peeringAccepterInternal);
    	}
    	Peering p = peeringRepository.save(peering);
    	return p;
    }
    
    @PutMapping("/vpcs/{vpcId}/peerings/{peeringId}")
    public Peering updatePeering(@PathVariable Long vpcId, @PathVariable Long peeringId,
                               @Valid @RequestBody Peering peeringRequest) {
    	
    	if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
    	
        return peeringRepository.findById(peeringId)
                .map(p -> {
                	p.setText(peeringRequest.getText());
                	p.setName(peeringRequest.getName());
                	p.setType(peeringRequest.getType());
                	p.setVpc(peeringRequest.getVpc());
                	p.setAccount(peeringRequest.getAccount());
                	//
                	
                	if(peeringRequest.getType().equals("External"))
                	{
                		PeeringAccepterExternal peeringAccepterExternal = p.getPeeringAccepterExternal();
                		
                		Optional<Region> region = regionRepository.findById(peeringRequest.getPeeringAccepterExternal().getRegion().getId());
                		peeringAccepterExternal.setOwner(peeringRequest.getPeeringAccepterExternal().getOwner());
               		 	peeringAccepterExternal.setVpcId(peeringRequest.getPeeringAccepterExternal().getVpcId());
               		 	peeringAccepterExternal.setRegion(region.get());
               		 	
               		 	peeringAccepterExternal.setPeering(p);
               		 	p.setPeeringAccepterExternal(peeringAccepterExternal);
               		 	peeringAccepterExternal = peeringAccepterExternalRepository.save(peeringAccepterExternal);
                	}
                	else
                	{
                		PeeringAccepterInternal peeringAccepterInternal = p.getPeeringAccepterInternal();
                		
                		Optional<Vpc> vpc = vpcRepository.findById(peeringRequest.getPeeringAccepterInternal().getVpc().getId());
                		
               		 	peeringAccepterInternal.setVpc(vpc.get());
               		 	peeringAccepterInternal.setPeering(p);
               		 	p.setPeeringAccepterInternal(peeringAccepterInternal);
               		 	peeringAccepterInternal = peeringAccepterInternalRepository.save(peeringAccepterInternal);
                	}
                	
                	
                	
                    return peeringRepository.save(p);
                }).orElseThrow(() -> new ResourceNotFoundException("peering not found with id " + peeringId));
    }

    @DeleteMapping("/vpcs/{vpcId}/peerings/{peeringId}")
    public ResponseEntity<?> deletePeering(@PathVariable Long vpcId,
    									   @PathVariable Long peeringId) {

    	if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        return peeringRepository.findById(peeringId)
                .map(peering -> {
                	
                	peeringRepository.delete(peering);
                	
                	if(peering.getType().equals("Internal"))
                	{
                		PeeringAccepterInternal pi = peering.getPeeringAccepterInternal();
                		
                		peeringAccepterInternalRepository.delete(pi);
                	}else {
                		PeeringAccepterExternal pe = peering.getPeeringAccepterExternal();
                		
                		peeringAccepterExternalRepository.delete(pe);
                	}
                	
                	
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("peering not found with id " + peeringId));

    }
}
