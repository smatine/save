package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Product;
import com.example.referentiel.model.Trigramme;
import com.example.referentiel.repository.ProductRepository;
import com.example.referentiel.repository.TrigrammeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TrigrammeRepository trigrammeRepository;

    @GetMapping("/trigrammes/{trigrammeId}/products")
    public List<Product> getProductsByTrigrammeId(@PathVariable Long trigrammeId) {
        return productRepository.findByTrigrammeId(trigrammeId);
    }

    
    
    @GetMapping("/products")
    Collection<Product> products() {
    	
        return productRepository.findAll();
    }
    
    @GetMapping("/products/{id}")
    ResponseEntity<?> getProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        
        System.out.println("product:" +  product.toString());
        
        return product.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/trigrammes/{trigrammeId}/products")
    public Product addProduct(@PathVariable String trigrammeId,
                            @Valid @RequestBody Product product) {
    	
    	long accId = Long.valueOf(trigrammeId);
        return trigrammeRepository.findById(accId)
                .map(trigramme -> {
                	product.setTrigramme(trigramme);
                    return productRepository.save(product);
                }).orElseThrow(() -> new ResourceNotFoundException("Trigramme not found with id " + trigrammeId));
    }

    @PutMapping("/trigrammes/{trigrammeId}/products/{productId}")
    public Product updateProduct(@PathVariable Long trigrammeId,
                               @PathVariable Long productId,
                               @Valid @RequestBody Product productRequest) {
        if(!trigrammeRepository.existsById(trigrammeId)) {
            throw new ResourceNotFoundException("Trigramme not found with id " + trigrammeId);
        }
        Optional<Trigramme> trigramme = trigrammeRepository.findById(trigrammeId);
        return productRepository.findById(productId)
                .map(product -> {
                	product.setText(productRequest.getText());
                	product.setName(productRequest.getName());
                	product.setAppContext(productRequest.getAppContext());
                	product.setType(productRequest.getType());
                	product.setMailList(productRequest.getMailList());
                	product.setMailListAlert(productRequest.getMailListAlert());
                	product.setBastion(productRequest.getBastion());
                	
                	product.setTrigramme(trigramme.get());
                	
                    return productRepository.save(product);
                }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));
    }

    @DeleteMapping("/trigrammes/{trigrammeId}/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long trigrammeId,
                                          @PathVariable Long productId) {
        if(!trigrammeRepository.existsById(trigrammeId)) {
            throw new ResourceNotFoundException("Trigramme not found with id " + trigrammeId);
        }

        return productRepository.findById(productId)
                .map(product -> {
                	productRepository.delete(product);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

    }
}
