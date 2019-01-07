package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Product;
import com.example.referentiel.model.Rds;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Trigramme;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.ProductRepository;
import com.example.referentiel.repository.RegionRepository;
import com.example.referentiel.repository.TrigrammeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/api")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private TrigrammeRepository trigrammeRepository;

    @GetMapping("/trigrammes/{trigrammeId}/accounts")
    public List<Account> getAccountsByProductId(@PathVariable Long trigrammeId) {
        return accountRepository.findByTrigrammeId(trigrammeId);
    }
    
    
    @GetMapping("/accounts")
    Collection<Account> accounts() {
    	
        return accountRepository.findAll();
    }

    @GetMapping("/accounts/{id}")
    ResponseEntity<?> getAccount(@PathVariable Long id) {
        Optional<Account> account = accountRepository.findById(id);
        
        System.out.println("account:" +  account.toString());
        
        return account.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    /*
    @GetMapping("/account/{id}")
    ResponseEntity<?> getAccoun(@PathVariable String id) {
    	
    	Long idl = Long.valueOf(id);
        Optional<Account> account = accountRepository.findById(idl);
        
        System.out.println("account:" +  account.toString());
        
        return account.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    */
    
    @PostMapping("/trigrammes/{trigrammeId}/accounts")
    public Account addAccount(@PathVariable Long trigrammeId,
                            @Valid @RequestBody Account account) {
    	List<Product> products = account.getProducts();
    	List<Product> product = new ArrayList<>();
    	Iterator<Product> itp = products.iterator();
    	while(itp.hasNext()) {
    		Product p = (Product)itp.next();
    		Optional<Product> pr = productRepository.findById(p.getId());
    		Product pp = pr.get();
    	    pp.getAccounts().add(account);
    	    product.add(pp);
    	}
    	account.setProducts(product);
    	
        return trigrammeRepository.findById(trigrammeId)
                .map(trigramme -> {
                    account.setTrigramme(trigramme);
                    
                    
                	Account a = accountRepository.save(account);
                	Iterator<Product> itps = product.iterator();
                	while(itps.hasNext()) {
                		Product s = (Product)itps.next();
                		productRepository.save(s);
                	}
                	
                    return a;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("Trigramme not found with id " + trigrammeId));
    }
    
    /*
    @PostMapping("/products/{productId}/accounts")
    public Account addAccount(@PathVariable String productId,
                            @Valid @RequestBody Account account) {
    	
    	long triId = Long.valueOf(productId);
        return productRepository.findById(triId)
                .map(product -> {
                    account.setProduct(product);
                    return accountRepository.save(account);
                }).orElseThrow(() -> new ResourceNotFoundException("product not found with id " + productId));
    }*/
    /*
    @PutMapping("/products/{productId}/accounts/{accountId}")
    public Account updateAccount(@PathVariable Long productId,
                               @PathVariable Long accountId,
                               @Valid @RequestBody Account accountRequest) {
        if(!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("product not found with id " + productId);
        }
        Optional<Product> product = productRepository.findById(productId);
        
        return accountRepository.findById(accountId)
                .map(account -> {
                    account.setText(accountRequest.getText());
                    account.setEnv(accountRequest.getEnv());
                    account.setNumAccount(accountRequest.getNumAccount());
                    account.setMailList(accountRequest.getMailList());
                    account.setAlias(accountRequest.getAlias());
                    account.setProduct(product.get());
                    return accountRepository.save(account);
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));
    }*/
    /*
    @DeleteMapping("/products/{productId}/accounts/{accountId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long productId,
                                          @PathVariable Long accountId) {
        if(!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("product not found with id " + productId);
        }

        return accountRepository.findById(accountId)
                .map(account -> {
                	
                    accountRepository.delete(account);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));

    }*/
    @PutMapping("/trigrammes/{trigrammeId}/accounts/{accountId}")
    public Account updateAccount(@PathVariable Long trigrammeId,
                               @PathVariable Long accountId,
                               @Valid @RequestBody Account accountRequest) {
        if(!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("accountId not found with id " + accountId);
        }
        Optional<Trigramme> trigramme = trigrammeRepository.findById(trigrammeId);
        
        List<Product> products = accountRequest.getProducts();
    	List<Product> product = new ArrayList<>();
    	Iterator<Product> itp = products.iterator();
    	while(itp.hasNext()) {
    		Product p = (Product)itp.next();
    		Optional<Product> pr = productRepository.findById(p.getId());
    		Product pp = pr.get();
    	    pp.getAccounts().add(accountRequest);
    	    product.add(pp);
    	}
        return accountRepository.findById(accountId)
                .map(account -> {
                	
                	Iterator<Product> itps = account.getProducts().iterator();
                	while(itps.hasNext()) {
                		Product p = (Product)itps.next();
                		p.getAccounts().remove(account);
                		productRepository.save(p);
                	}
                	
                    account.setText(accountRequest.getText());
                    account.setEnv(accountRequest.getEnv());
                    account.setNumAccount(accountRequest.getNumAccount());
                    account.setMailList(accountRequest.getMailList());
                    account.setAlias(accountRequest.getAlias());
                    account.setTrigramme(trigramme.get());
                    account.setProducts(product);
                    return accountRepository.save(account);
                }).orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + accountId));
    }
    @DeleteMapping("/trigrammes/{trigrammeId}/accounts/{accountId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long trigrammeId,
                                          @PathVariable Long accountId) {
        if(!trigrammeRepository.existsById(trigrammeId)) {
            throw new ResourceNotFoundException("Trigramme not found with id " + trigrammeId);
        }

        return accountRepository.findById(accountId)
                .map(account -> {
                	accountRepository.delete(account);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("account not found with id " + accountId));

    }
}
