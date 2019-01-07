package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Policy;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.PolicyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AccountRepository accountRepository;
    

    @GetMapping("/accounts/{accountId}/policys")
    public List<Policy> getPolicysByProductId(@PathVariable Long accountId) {
        return policyRepository.findByAccountId(accountId);
    }
    
    @GetMapping("/policys")
    Collection<Policy> policys() {
    	
        return policyRepository.findAll();
    }
    
    @GetMapping("/policys/{id}")
    ResponseEntity<?> getPolicy(@PathVariable Long id) {
        Optional<Policy> policy = policyRepository.findById(id);
        
        return policy.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/policys")
    public Policy addPolicy(@PathVariable String accountId,
                            @Valid @RequestBody Policy policy) {
    	
    	long prdId = Long.valueOf(accountId);
    	
        return accountRepository.findById(prdId)
                .map(account -> {
                    policy.setAccount(account);
                    return policyRepository.save(policy);
                    
                }).orElseThrow(() -> new ResourceNotFoundException("account not found with id " + accountId));         
    }
    
    @PutMapping("/accounts/{accountId}/policys/{policyId}")
    public Policy updatePolicy(@PathVariable Long accountId,
                               @PathVariable Long policyId,
                               @Valid @RequestBody Policy policyRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        return policyRepository.findById(policyId)
                .map(policy -> {
                    policy.setName(policyRequest.getName());
                    
                    policy.setPolicyJson(policyRequest.getPolicyJson());
                    policy.setDescription(policyRequest.getDescription());
                    policy.setAccount(account.get());
                    return policyRepository.save(policy);
                }).orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + policyId));
    }

    @DeleteMapping("/accounts/{accountId}/policys/{policyId}")
    public ResponseEntity<?> deletePolicy(@PathVariable Long accountId,
                                          @PathVariable Long policyId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        return policyRepository.findById(policyId)
                .map(policy -> {
                    policyRepository.delete(policy);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + policyId));

    }
}
