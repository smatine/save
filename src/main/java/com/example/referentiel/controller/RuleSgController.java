package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.RuleSg;
import com.example.referentiel.model.Sg;
import com.example.referentiel.repository.RuleSgRepository;
import com.example.referentiel.repository.SgRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class RuleSgController {

    @Autowired
    private RuleSgRepository ruleSgRepository;

    @Autowired
    private SgRepository sgRepository;
    

    @GetMapping("/sgs/{sgId}/ruleSgs")
    public List<RuleSg> getRuleSgsBySgId(@PathVariable Long sgId) {
        return ruleSgRepository.findBySgId(sgId);
    }

    @GetMapping("/ruleSgs")
    Collection<RuleSg> ruleSgs() {
    	Collection<RuleSg> ruleSgs = ruleSgRepository.findAll();  	
        return ruleSgs;
    }
    
    @GetMapping("/ruleSgs/{id}")
    ResponseEntity<?> getRuleSg(@PathVariable Long id) {
        Optional<RuleSg> ruleSg = ruleSgRepository.findById(id);
        
        return ruleSg.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/sgs/{sgId}/ruleSgs")
    public RuleSg addRuleSg(@PathVariable String sgId,
                            @Valid @RequestBody RuleSg ruleSg) {
    	
    	long accId = Long.valueOf(sgId);
        return sgRepository.findById(accId)
                .map(sg -> {
                	ruleSg.setSg(sg);
                    return ruleSgRepository.save(ruleSg);
                }).orElseThrow(() -> new ResourceNotFoundException("Sg not found with id " + sgId));
    }

    @PutMapping("/sgs/{sgId}/ruleSgs/{ruleSgId}")
    public RuleSg updateRuleSg(@PathVariable Long sgId,
                               @PathVariable Long ruleSgId,
                               @Valid @RequestBody RuleSg ruleSgRequest) {
        if(!sgRepository.existsById(sgId)) {
            throw new ResourceNotFoundException("Sg not found with id " + sgId);
        }
        Optional<Sg> sg = sgRepository.findById(sgId);
        
        return ruleSgRepository.findById(ruleSgId)
                .map(ruleSg -> {
                	ruleSg.setText(ruleSgRequest.getText());
                	
                	ruleSg.setType(ruleSgRequest.getType());
                	
                	
                	ruleSg.setRuleType(ruleSgRequest.getRuleType());
                	ruleSg.setProtocol(ruleSgRequest.getProtocol());
                	ruleSg.setPortRange(ruleSgRequest.getPortRange());
                	ruleSg.setCidr(ruleSgRequest.getCidr());
                	
                	
                	ruleSg.setSg(sg.get());
                	
                    return ruleSgRepository.save(ruleSg);
                }).orElseThrow(() -> new ResourceNotFoundException("RuleSg not found with id " + ruleSgId));
    }

    @DeleteMapping("/sgs/{sgId}/ruleSgs/{ruleSgId}")
    public ResponseEntity<?> deleteRuleSg(@PathVariable Long sgId,
                                          @PathVariable Long ruleSgId) {
        if(!sgRepository.existsById(sgId)) {
            throw new ResourceNotFoundException("Sg not found with id " + sgId);
        }

        return ruleSgRepository.findById(ruleSgId)
                .map(ruleSg -> {
                	ruleSgRepository.delete(ruleSg);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("RuleSg not found with id " + ruleSgId));

    }
}
