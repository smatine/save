package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Rule;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.repository.RuleRepository;
import com.example.referentiel.repository.NaclRepository;

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
public class RuleController {

    @Autowired
    private RuleRepository ruleRepository;

    @Autowired
    private NaclRepository naclRepository;
    

    @GetMapping("/nacls/{naclId}/rules")
    public List<Rule> getRulesByNaclId(@PathVariable Long naclId) {
        return ruleRepository.findByNaclId(naclId);
    }

    @GetMapping("/rules")
    Collection<Rule> rules() {
    	Collection<Rule> rules = ruleRepository.findAll();  	
        return rules;
    }
    
    @GetMapping("/rules/{id}")
    ResponseEntity<?> getRule(@PathVariable Long id) {
        Optional<Rule> rule = ruleRepository.findById(id);
        
        return rule.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/nacls/{naclId}/rules")
    public Rule addRule(@PathVariable String naclId,
                            @Valid @RequestBody Rule rule) {
    	
    	long accId = Long.valueOf(naclId);
        return naclRepository.findById(accId)
                .map(nacl -> {
                	rule.setNacl(nacl);
                    return ruleRepository.save(rule);
                }).orElseThrow(() -> new ResourceNotFoundException("Nacl not found with id " + naclId));
    }

    @PutMapping("/nacls/{naclId}/rules/{ruleId}")
    public Rule updateRule(@PathVariable Long naclId,
                               @PathVariable Long ruleId,
                               @Valid @RequestBody Rule ruleRequest) {
        if(!naclRepository.existsById(naclId)) {
            throw new ResourceNotFoundException("Nacl not found with id " + naclId);
        }
        Optional<Nacl> nacl = naclRepository.findById(naclId);
        
        return ruleRepository.findById(ruleId)
                .map(rule -> {
                	rule.setText(ruleRequest.getText());
                	
                	rule.setType(ruleRequest.getType());
                	
                	rule.setNumber(ruleRequest.getNumber());
                	rule.setRuleType(ruleRequest.getRuleType());
                	rule.setProtocol(ruleRequest.getProtocol());
                	rule.setPortRange(ruleRequest.getPortRange());
                	rule.setCidr(ruleRequest.getCidr());
                	rule.setAllow(ruleRequest.getAllow());
                	
                	rule.setNacl(nacl.get());
                	
                    return ruleRepository.save(rule);
                }).orElseThrow(() -> new ResourceNotFoundException("Rule not found with id " + ruleId));
    }

    @DeleteMapping("/nacls/{naclId}/rules/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable Long naclId,
                                          @PathVariable Long ruleId) {
        if(!naclRepository.existsById(naclId)) {
            throw new ResourceNotFoundException("Nacl not found with id " + naclId);
        }

        return ruleRepository.findById(ruleId)
                .map(rule -> {
                	ruleRepository.delete(rule);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Rule not found with id " + ruleId));

    }
}
