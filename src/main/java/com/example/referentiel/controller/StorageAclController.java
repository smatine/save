package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Storage;
import com.example.referentiel.model.StorageAcl;
import com.example.referentiel.model.Storage;
import com.example.referentiel.repository.StorageAclRepository;
import com.example.referentiel.repository.StorageRepository;
import com.example.referentiel.repository.StorageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
public class StorageAclController {

    @Autowired
    private StorageAclRepository storageAclRepository;

    @Autowired
    private StorageRepository storageRepository;

    @GetMapping("/storages/{storageId}/storageAcls")
    public List<StorageAcl> getStorageAclsByStorageId(@PathVariable Long storageId) {
        return storageAclRepository.findByStorageId(storageId);
    }

    @GetMapping("/storageAcls")
    Collection<StorageAcl> storageAcls() {
    	
        return storageAclRepository.findAll();
    }
    
    @GetMapping("/storageAcls/{id}")
    ResponseEntity<?> getStorageAcl(@PathVariable Long id) {
        Optional<StorageAcl> storageAcl = storageAclRepository.findById(id);
                
        return storageAcl.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/storages/{storageId}/storageAcls")
    public StorageAcl addStorageAcl(@PathVariable String storageId,
                            @Valid @RequestBody StorageAcl storageAcl) {
    	
    	long accId = Long.valueOf(storageId);
        return storageRepository.findById(accId)
                .map(storage -> {            	
                	storageAcl.setStorage(storage);
                    return storageAclRepository.save(storageAcl);
                }).orElseThrow(() -> new ResourceNotFoundException("Storage not found with id " + storageId));
    }

    @PutMapping("/storages/{storageId}/storageAcls/{storageAclId}")
    public StorageAcl updateStorageAcl(@PathVariable Long storageId,
                               @PathVariable Long storageAclId,
                               @Valid @RequestBody StorageAcl storageAclRequest) {
        if(!storageRepository.existsById(storageId)) {
            throw new ResourceNotFoundException("Storage not found with id " + storageId);
        }
        Optional<Storage> storage = storageRepository.findById(storageId);
        
        return storageAclRepository.findById(storageAclId)
                .map(storageAcl -> {
                	
                	storageAcl.setAccount(storageAclRequest.getAccount());
                	storageAcl.setExternalAccount(storageAclRequest.getExternalAccount());
                	storageAcl.setStore(storageAclRequest.getStore());
                	storageAcl.setGroupe(storageAclRequest.getGroupe());
                	
                	storageAcl.setType(storageAclRequest.getType());
                	storageAcl.setRead(storageAclRequest.isRead());
                	storageAcl.setWrite(storageAclRequest.isWrite());
                	
                	storageAcl.setListObject(storageAclRequest.isListObject());
                	storageAcl.setWriteObject(storageAclRequest.isWriteObject());
                	
                	
                	storageAcl.setStorage(storage.get());
                	
                    return storageAclRepository.save(storageAcl);
                    
                }).orElseThrow(() -> new ResourceNotFoundException("StorageAcl not found with id " + storageAclId));
    }

    @DeleteMapping("/storages/{storageId}/storageAcls/{storageAclId}")
    public ResponseEntity<?> deleteStorageAcl(@PathVariable Long storageId,
                                          @PathVariable Long storageAclId) {
        if(!storageRepository.existsById(storageId)) {
            throw new ResourceNotFoundException("Storage not found with id " + storageId);
        }

        return storageAclRepository.findById(storageAclId)
                .map(storageAcl -> {
                	storageAclRepository.delete(storageAcl);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("StorageAcl not found with id " + storageAclId));

    }
}
