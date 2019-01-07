package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Role;
import com.example.referentiel.model.Kms;

import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.User;

import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.RoleRepository;
import com.example.referentiel.repository.UserRepository;
import com.example.referentiel.repository.KmsRepository;

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
public class KmsController {

    @Autowired
    private KmsRepository kmsRepository;

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/accounts/{accountId}/kmss")
    public List<Kms> getKmssByAccountId(@PathVariable Long accountId) {
        return kmsRepository.findByAccountId(accountId);
    }
    
    @GetMapping("/kmss")
    Collection<Kms> kmss() {
        return kmsRepository.findAll();
    }
    
    @GetMapping("/kmss/{id}")
    ResponseEntity<?> getKms(@PathVariable Long id) {
        Optional<Kms> kms = kmsRepository.findById(id);
        
        return kms.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/kmss")
    public Kms addKms(@PathVariable String accountId,
                            @Valid @RequestBody Kms kms) {
    	
    	long prdId = Long.valueOf(accountId);
    	
    	List<Role> grps = kms.getRoles();
    	List<Role> roles = new ArrayList<>();
    	Iterator<Role> it = grps.iterator();
    	while(it.hasNext()) {
    		Role gp = (Role)it.next();
    		Optional<Role> role = roleRepository.findById(gp.getId());
    	    role.get().getKmss().add(kms);
    	    roles.add(role.get());
    	}
    	
    	List<User> us = kms.getUsers();
    	List<User> users = new ArrayList<>();
    	Iterator<User> itu = us.iterator();
    	while(itu.hasNext()) {
    		User ur = (User)itu.next();
    		Optional<User> user = userRepository.findById(ur.getId());
    	    user.get().getKmss().add(kms);
    	    users.add(user.get());
    	}
        return accountRepository.findById(prdId)
                .map(account -> {
                	kms.setRoles(roles);
                	kms.setUsers(users);
                    kms.setAccount(account);
                    Kms re = kmsRepository.save(kms);
                	Iterator<Role> itt = roles.iterator();
                	while(itt.hasNext()) {
                		Role gp = (Role)itt.next();
                		roleRepository.save(gp);
                	}
                	Iterator<User> ittu = users.iterator();
                	while(ittu.hasNext()) {
                		User use = (User)ittu.next();
                		userRepository.save(use);
                	}
                    return re;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("account not found with id " + accountId));         
    }
    
    @PutMapping("/accounts/{accountId}/kmss/{kmsId}")
    public Kms updateKms(@PathVariable Long accountId,
                               @PathVariable Long kmsId,
                               @Valid @RequestBody Kms kmsRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        
        List<Role> rs = kmsRequest.getRoles();
    	List<Role> roles = new ArrayList<>();
    	Iterator<Role> it = rs.iterator();
    	while(it.hasNext()) {
    		Role gp = (Role)it.next();
    		Optional<Role> role = roleRepository.findById(gp.getId());
    	    role.get().getKmss().add(kmsRequest);
    	    roles.add(role.get());
    	}
    	
    	List<User> us = kmsRequest.getUsers();
    	List<User> users = new ArrayList<>();
    	Iterator<User> itu = us.iterator();
    	while(itu.hasNext()) {
    		User ur = (User)itu.next();
    		Optional<User> user = userRepository.findById(ur.getId());
    	    user.get().getKmss().add(kmsRequest);
    	    users.add(user.get());
    	}
    	
        return kmsRepository.findById(kmsId)
                .map(kms -> {
                	Iterator<Role> iti = kms.getRoles().iterator();
                	while(iti.hasNext()) {
                		Role gp = (Role)iti.next();
                		gp.getKmss().remove(kms);
                		roleRepository.save(gp);
                	}
                	
                	Iterator<User> itiu = kms.getUsers().iterator();
                	while(itiu.hasNext()) {
                		User use = (User)itiu.next();
                		use.getKmss().remove(kms);
                		userRepository.save(use);
                	}
                	
                    kms.setAlias(kmsRequest.getAlias());
                    kms.setText(kmsRequest.getText());
                    kms.setKeyMaterialOrigin(kmsRequest.getKeyMaterialOrigin());
                    kms.setPolicy(kmsRequest.getPolicy());
                    kms.setAccount(account.get());
                    
                    
                    kms.setRoles(roles);
                    kms.setUsers(users);
        
                    Kms re = kmsRepository.save(kms);
                    
                	Iterator<Role> itt = roles.iterator();
                	while(itt.hasNext()) {
                		Role gp = (Role)itt.next();
                		roleRepository.save(gp);
                	}
                	
                	Iterator<User> ittu = users.iterator();
                	while(ittu.hasNext()) {
                		User use = (User)ittu.next();
                		userRepository.save(use);
                	}
                    return re;
                   
                }).orElseThrow(() -> new ResourceNotFoundException("Kms not found with id " + kmsId));
    }

    @DeleteMapping("/accounts/{accountId}/kmss/{kmsId}")
    public ResponseEntity<?> deleteKms(@PathVariable Long accountId,
                                          @PathVariable Long kmsId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        return kmsRepository.findById(kmsId)
                .map(kms -> {
                	Iterator<Role> iti = kms.getRoles().iterator();
                	while(iti.hasNext()) {
                		Role gp = (Role)iti.next();
                		gp.getKmss().remove(kms);
                		roleRepository.save(gp);
                	}
                	Iterator<User> itiu = kms.getUsers().iterator();
                	while(itiu.hasNext()) {
                		User use = (User)itiu.next();
                		use.getKmss().remove(kms);
                		userRepository.save(use);
                	}
                    kmsRepository.delete(kms);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Kms not found with id " + kmsId));

    }
}
