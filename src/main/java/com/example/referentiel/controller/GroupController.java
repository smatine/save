package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Policy;
import com.example.referentiel.model.Group;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.PolicyRepository;
import com.example.referentiel.repository.GroupRepository;

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
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private PolicyRepository policyRepository;

    @GetMapping("/accounts/{accountId}/groups")
    public List<Group> getGroupsByProductId(@PathVariable Long accountId) {
        return groupRepository.findByAccountId(accountId);
    }
    
    @GetMapping("/groups")
    Collection<Group> groups() {
    	
        return groupRepository.findAll();
    }
    
    @GetMapping("/groups/{id}")
    ResponseEntity<?> getGroup(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        
        return group.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/groups")
    public Group addGroup(@PathVariable String accountId,
                            @Valid @RequestBody Group group) {
    	
    	long prdId = Long.valueOf(accountId);
    	
    	List<Policy> polics = group.getPolicys();
    	List<Policy> policys = new ArrayList<>();
    	Iterator<Policy> it = polics.iterator();
    	while(it.hasNext()) {
    		Policy py = (Policy)it.next();
    		Optional<Policy> policy = policyRepository.findById(py.getId());
    	    policy.get().getGroups().add(group);
    	    policys.add(policy.get());
    	}
    	
        return accountRepository.findById(prdId)
                .map(account -> {
                	group.setPolicys(policys);
                    group.setAccount(account);
                    Group re = groupRepository.save(group);
                	Iterator<Policy> itt = policys.iterator();
                	while(itt.hasNext()) {
                		Policy py = (Policy)itt.next();
                		policyRepository.save(py);
                	}
                	
                    return re;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("account not found with id " + accountId));         
    }
    
    @PutMapping("/accounts/{accountId}/groups/{groupId}")
    public Group updateGroup(@PathVariable Long accountId,
                               @PathVariable Long groupId,
                               @Valid @RequestBody Group groupRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        
        List<Policy> polics = groupRequest.getPolicys();
    	List<Policy> policys = new ArrayList<>();
    	Iterator<Policy> it = polics.iterator();
    	while(it.hasNext()) {
    		Policy py = (Policy)it.next();
    		Optional<Policy> policy = policyRepository.findById(py.getId());
    	    policy.get().getGroups().add(groupRequest);
    	    policys.add(policy.get());
    	}
        return groupRepository.findById(groupId)
                .map(group -> {
                	Iterator<Policy> iti = group.getPolicys().iterator();
                	while(iti.hasNext()) {
                		Policy py = (Policy)iti.next();
                		py.getGroups().remove(group);
                		policyRepository.save(py);
                	}
                    group.setName(groupRequest.getName());
                    
                    group.setAccount(account.get());
                    
                    group.setPolicys(policys);
        
                    Group re = groupRepository.save(group);
                	Iterator<Policy> itt = policys.iterator();
                	while(itt.hasNext()) {
                		Policy py = (Policy)itt.next();
                		policyRepository.save(py);
                	}
                	
                    return re;
                   
                }).orElseThrow(() -> new ResourceNotFoundException("Group not found with id " + groupId));
    }

    @DeleteMapping("/accounts/{accountId}/groups/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long accountId,
                                          @PathVariable Long groupId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        return groupRepository.findById(groupId)
                .map(group -> {
                	Iterator<Policy> iti = group.getPolicys().iterator();
                	while(iti.hasNext()) {
                		Policy py = (Policy)iti.next();
                		py.getGroups().remove(group);
                		policyRepository.save(py);
                	}
                    groupRepository.delete(group);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Group not found with id " + groupId));

    }
}
