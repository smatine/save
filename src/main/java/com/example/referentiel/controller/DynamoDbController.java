package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.DynamoDb;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.DynamoDbRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class DynamoDbController {

    @Autowired
    private DynamoDbRepository dynamoDbRepository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/accounts/{accountId}/dynamoDbs")
    public List<DynamoDb> getDynamoDbsByAccountId(@PathVariable Long accountId) {
        return dynamoDbRepository.findByAccountId(accountId);
    }

    @GetMapping("/dynamoDbs")
    Collection<DynamoDb> dynamoDbs() {
    	
        return dynamoDbRepository.findAll();
    }
    
    @GetMapping("/dynamoDbs/{id}")
    ResponseEntity<?> getDynamoDb(@PathVariable Long id) {
        Optional<DynamoDb> dynamoDb = dynamoDbRepository.findById(id);
        
        System.out.println("dynamoDb:" +  dynamoDb.toString());
        
        return dynamoDb.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/dynamoDbs")
    public DynamoDb addDynamoDb(@PathVariable String accountId,
                            @Valid @RequestBody DynamoDb dynamoDb) {
    	
    	long accId = Long.valueOf(accountId);
        return accountRepository.findById(accId)
                .map(account -> {
                	dynamoDb.setAccount(account);
                    return dynamoDbRepository.save(dynamoDb);
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));
    }

    @PutMapping("/accounts/{accountId}/dynamoDbs/{dynamoDbId}")
    public DynamoDb updateDynamoDb(@PathVariable Long accountId,
                               @PathVariable Long dynamoDbId,
                               @Valid @RequestBody DynamoDb dynamoDbRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        return dynamoDbRepository.findById(dynamoDbId)
                .map(dynamoDb -> {
                	dynamoDb.setText(dynamoDbRequest.getText());
                	dynamoDb.setName(dynamoDbRequest.getName());
                	
                	dynamoDb.setAccount(account.get());
                	
                    return dynamoDbRepository.save(dynamoDb);
                }).orElseThrow(() -> new ResourceNotFoundException("DynamoDb not found with id " + dynamoDbId));
    }

    @DeleteMapping("/accounts/{accountId}/dynamoDbs/{dynamoDbId}")
    public ResponseEntity<?> deleteDynamoDb(@PathVariable Long accountId,
                                          @PathVariable Long dynamoDbId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id " + accountId);
        }

        return dynamoDbRepository.findById(dynamoDbId)
                .map(dynamoDb -> {
                	dynamoDbRepository.delete(dynamoDb);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("DynamoDb not found with id " + dynamoDbId));

    }
}
