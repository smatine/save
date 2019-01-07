package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Policy;
import com.example.referentiel.model.Role;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.PolicyRepository;
import com.example.referentiel.repository.RoleRepository;

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
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private PolicyRepository policyRepository;

    @GetMapping("/accounts/{accountId}/roles")
    public List<Role> getRolesByProductId(@PathVariable Long accountId) {
        return roleRepository.findByAccountId(accountId);
    }
    
    @GetMapping("/roles")
    Collection<Role> roles() {
    	
        return roleRepository.findAll();
    }
    
    @GetMapping("/roles/{id}")
    ResponseEntity<?> getRole(@PathVariable Long id) {
        Optional<Role> role = roleRepository.findById(id);
        
        return role.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/accounts/{accountId}/roles")
    public Role addRole(@PathVariable String accountId,
                            @Valid @RequestBody Role role) {
    	
    	long prdId = Long.valueOf(accountId);
    	
    	List<Policy> polics = role.getPolicys();
    	List<Policy> policys = new ArrayList<>();
    	Iterator<Policy> it = polics.iterator();
    	while(it.hasNext()) {
    		Policy py = (Policy)it.next();
    		Optional<Policy> policy = policyRepository.findById(py.getId());
    	    policy.get().getRoles().add(role);
    	    policys.add(policy.get());
    	}
    	
        return accountRepository.findById(prdId)
                .map(account -> {
                	role.setPolicys(policys);
                    role.setAccount(account);
                    Role re = roleRepository.save(role);
                	Iterator<Policy> itt = policys.iterator();
                	while(itt.hasNext()) {
                		Policy py = (Policy)itt.next();
                		policyRepository.save(py);
                	}
                	
                    return re;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("account not found with id " + accountId));         
    }
    
    @PutMapping("/accounts/{accountId}/roles/{roleId}")
    public Role updateRole(@PathVariable Long accountId,
                               @PathVariable Long roleId,
                               @Valid @RequestBody Role roleRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        Optional<Account> account = accountRepository.findById(accountId);
        
        List<Policy> polics = roleRequest.getPolicys();
    	List<Policy> policys = new ArrayList<>();
    	Iterator<Policy> it = polics.iterator();
    	while(it.hasNext()) {
    		Policy py = (Policy)it.next();
    		Optional<Policy> policy = policyRepository.findById(py.getId());
    	    policy.get().getRoles().add(roleRequest);
    	    policys.add(policy.get());
    	}
        return roleRepository.findById(roleId)
                .map(role -> {
                	Iterator<Policy> iti = role.getPolicys().iterator();
                	while(iti.hasNext()) {
                		Policy py = (Policy)iti.next();
                		py.getRoles().remove(role);
                		policyRepository.save(py);
                	}
                    role.setName(roleRequest.getName());
                    role.setServiceName(roleRequest.getServiceName());
                    role.setDescription(roleRequest.getDescription());
                    role.setAccount(account.get());
                    
                    role.setPolicys(policys);
        
                    Role re = roleRepository.save(role);
                	Iterator<Policy> itt = policys.iterator();
                	while(itt.hasNext()) {
                		Policy py = (Policy)itt.next();
                		policyRepository.save(py);
                	}
                	
                    return re;
                   
                }).orElseThrow(() -> new ResourceNotFoundException("Role not found with id " + roleId));
    }

    @DeleteMapping("/accounts/{accountId}/roles/{roleId}")
    public ResponseEntity<?> deleteRole(@PathVariable Long accountId,
                                          @PathVariable Long roleId) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("account not found with id " + accountId);
        }
        return roleRepository.findById(roleId)
                .map(role -> {
                	Iterator<Policy> iti = role.getPolicys().iterator();
                	while(iti.hasNext()) {
                		Policy py = (Policy)iti.next();
                		py.getRoles().remove(role);
                		policyRepository.save(py);
                	}
                    roleRepository.delete(role);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Role not found with id " + roleId));

    }
}
