package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.model.Lb;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.LbRepository;
import com.example.referentiel.repository.SgRepository;
import com.example.referentiel.repository.VpcRepository;
import com.fasterxml.jackson.annotation.JsonInclude;

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
public class SgController {

    @Autowired
    private SgRepository sgRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private LbRepository lbRepository;
    

    @GetMapping("/vpcs/{vpcId}/sgs")
    public List<Sg> getSgsByVpcId(@PathVariable Long vpcId) {
        return sgRepository.findByVpcId(vpcId);
    }

    @GetMapping("/sgs")
    Collection<Sg> sgs() {
    	Collection<Sg> sgs = sgRepository.findAll();  

        return sgs;
    }
    
    @GetMapping("/sgs/{id}")
    ResponseEntity<?> getSg(@PathVariable Long id) {
        Optional<Sg> sg = sgRepository.findById(id);
        
        return sg.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/sgs")
    public Sg addSg(@PathVariable String vpcId,
                            @Valid @RequestBody Sg sg) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	sg.setVpc(vpc);
                    return sgRepository.save(sg);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/sgs/{sgId}")
    public Sg updateSg(@PathVariable Long vpcId,
                               @PathVariable Long sgId,
                               @Valid @RequestBody Sg sgRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        
        return sgRepository.findById(sgId)
                .map(sg -> {
                	sg.setText(sgRequest.getText());
                	sg.setName(sgRequest.getName());
                	sg.setNameTag(sgRequest.getNameTag());
                	sg.setVpc(vpc.get());
                	sg.setAccount(sgRequest.getAccount());
                	sg.setProduct(sgRequest.getProduct());
                	/* sma
                	List<Lb> lbs = sgRequest.getLbs();
                	List<Lb> sgLbs = new ArrayList<Lb>();
                	for(int i = 0; i< lbs.size();i++) {
                		Optional<Lb> lb = lbRepository.findById(lbs.get(i).getId());
                		sgLbs.add(lb.get());	
                	}
                   sg.setLbs(sgLbs);
                	*/
                    return sgRepository.save(sg);
                }).orElseThrow(() -> new ResourceNotFoundException("Sg not found with id " + sgId));
    }

    @DeleteMapping("/vpcs/{vpcId}/sgs/{sgId}")
    public ResponseEntity<?> deleteSg(@PathVariable Long vpcId,
                                          @PathVariable Long sgId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return sgRepository.findById(sgId)
                .map(sg -> {
                	sgRepository.delete(sg);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Sg not found with id " + sgId));

    }
}
