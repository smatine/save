package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Cognito;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.CognitoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class CognitoController {

    @Autowired
    private CognitoRepository cognitoRepository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/accounts/{accountId}/cognitos")
    public List<Cognito> getCognitosByAccountId(@PathVariable Long accountId) {
        return cognitoRepository.findByAccountId(accountId);
    }

    @GetMapping("/cognitos")
    Collection<Cognito> cognitos() {
    	
        return cognitoRepository.findAll();
    }
    
    @GetMapping("/cognitos/{id}")
    ResponseEntity<?> getCognito(@PathVariable Long id) {
        Optional<Cognito> cognito = cognitoRepository.findById(id);
        
        System.out.println("cognito:" +  cognito.toString());
        
        return cognito.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/cognitos")
    public Cognito addCognito(@PathVariable String accountId,
                            @Valid @RequestBody Cognito cognito) {
    	
    	long accId = Long.valueOf(accountId);
        return accountRepository.findById(accId)
                .map(account -> {
                	cognito.setAccount(account);
                    return cognitoRepository.save(cognito);
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));
    }

    @PutMapping("/accounts/{accountId}/cognitos/{cognitoId}")
    public Cognito updateCognito(@PathVariable Long accountId,
                               @PathVariable Long cognitoId,
                               @Valid @RequestBody Cognito cognitoRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        return cognitoRepository.findById(cognitoId)
                .map(cognito -> {
                	cognito.setText(cognitoRequest.getText());
                	cognito.setName(cognitoRequest.getName());
                	
                	cognito.setAccount(account.get());
                	
                    return cognitoRepository.save(cognito);
                }).orElseThrow(() -> new ResourceNotFoundException("Cognito not found with id " + cognitoId));
    }

    @DeleteMapping("/accounts/{accountId}/cognitos/{cognitoId}")
    public ResponseEntity<?> deleteCognito(@PathVariable Long accountId,
                                          @PathVariable Long cognitoId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }

        return cognitoRepository.findById(cognitoId)
                .map(cognito -> {
                	cognitoRepository.delete(cognito);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Cognito not found with id " + cognitoId));

    }
}
