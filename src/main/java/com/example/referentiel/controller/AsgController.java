package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Asg;
import com.example.referentiel.model.Product;
import com.example.referentiel.repository.AsgRepository;
import com.example.referentiel.repository.ProductRepository;

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
public class AsgController {

    @Autowired
    private AsgRepository asgRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products/{productId}/asgs")
    public List<Asg> getAsgsByProductId(@PathVariable Long productId) {
        return asgRepository.findByProductId(productId);
    }
    
    @GetMapping("/asgs")
    Collection<Asg> asgs() {
    	
        return asgRepository.findAll();
    }
    
    @GetMapping("/asgs/{id}")
    ResponseEntity<?> getAsg(@PathVariable Long id) {
        Optional<Asg> asg = asgRepository.findById(id);
        
        System.out.println("product:" +  asg.toString());
        
        return asg.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
/*
    @PostMapping("/products/{productId}/vpcs")
    public Vpc addVpc(@PathVariable Long productId,
                            @Valid @RequestBody Vpc vpc) {
        return productRepository.findById(productId)
                .map(product -> {
                    vpc.setProduct(product);
                    return vpcRepository.save(vpc);
                }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));
    }

*/
    @PostMapping("/products/{productId}/asgs")
    
    public Asg addAsg(@PathVariable String productId,
                            @Valid @RequestBody Asg asg) {
    	System.out.println("product:" +  productId);
    	long prdId = Long.valueOf(productId);
    	
    
        return productRepository.findById(prdId)
                .map(product -> {
                	//System.out.println("product:" +  product.getAccount().getNumAccount() + " " + product.getAccount().getId());
                    asg.setProduct(product);
                    
                    
                    
                    return asgRepository.save(asg);
                    
                }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));
    }
    
    
    
    @PutMapping("/products/{productId}/asgs/{asgId}")
    public Asg updateAsg(@PathVariable Long productId,
                               @PathVariable Long asgId,
                               @Valid @RequestBody Asg asgRequest) {
        if(!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id " + productId);
        }

        return asgRepository.findById(asgId)
                .map(asg -> {
                	asg.setText(asgRequest.getText());
                	asg.setName(asgRequest.getName());
                    return asgRepository.save(asg);
                }).orElseThrow(() -> new ResourceNotFoundException("Asg not found with id " + asgId));
    }

    @DeleteMapping("/products/{productId}/asgs/{asgId}")
    public ResponseEntity<?> deleteAsg(@PathVariable Long productId,
                                          @PathVariable Long asgId) {
        if(!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id " + productId);
        }

        return asgRepository.findById(asgId)
                .map(asg -> {
                    asgRepository.delete(asg);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Asg not found with id " + asgId));

    }
}
