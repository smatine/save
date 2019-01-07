package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Ssm;

import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.SsmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class SsmController {

    @Autowired
    private SsmRepository ssmRepository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/accounts/{accountId}/ssms")
    public List<Ssm> getSsmsByAccountId(@PathVariable Long accountId) {
        return ssmRepository.findByAccountId(accountId);
    }

    @GetMapping("/ssms")
    Collection<Ssm> ssms() {
    	
        return ssmRepository.findAll();
    }
    
    @GetMapping("/ssms/{id}")
    ResponseEntity<?> getSsm(@PathVariable Long id) {
        Optional<Ssm> ssm = ssmRepository.findById(id);
        
        return ssm.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/ssms")
    public Ssm addSsm(@PathVariable String accountId,
                            @Valid @RequestBody Ssm ssm) {
    	
    	long accId = Long.valueOf(accountId);
        return accountRepository.findById(accId)
                .map(account -> {
                	ssm.setAccount(account);
                    return ssmRepository.save(ssm);
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));
    }

    @PutMapping("/accounts/{accountId}/ssms/{ssmId}")
    public Ssm updateSsm(@PathVariable Long accountId,
                               @PathVariable Long ssmId,
                               @Valid @RequestBody Ssm ssmRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        return ssmRepository.findById(ssmId)
                .map(ssm -> {
                	ssm.setText(ssmRequest.getText());
                	ssm.setName(ssmRequest.getName());
                	
                	ssm.setValue(ssmRequest.getValue());
                	ssm.setType(ssmRequest.getType());
                	ssm.setKeyKmsId(ssmRequest.getKeyKmsId());
                	//value type keyKmsId
                	ssm.setAccount(account.get());
                	
                    return ssmRepository.save(ssm);
                }).orElseThrow(() -> new ResourceNotFoundException("Ssm not found with id " + ssmId));
    }

    @DeleteMapping("/accounts/{accountId}/ssms/{ssmId}")
    public ResponseEntity<?> deleteSsm(@PathVariable Long accountId,
                                          @PathVariable Long ssmId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }

        return ssmRepository.findById(ssmId)
                .map(ssm -> {
                	ssmRepository.delete(ssm);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Ssm not found with id " + ssmId));

    }
}
