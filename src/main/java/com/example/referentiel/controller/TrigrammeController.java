package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Trigramme;
import com.example.referentiel.repository.TrigrammeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

import javax.validation.Valid;

@RestController
//@RequestMapping("/api")
public class TrigrammeController {

    @Autowired
    private TrigrammeRepository trigrammeRepository;

    /*
    @GetMapping("/trigrammes")
    public Page<Trigramme> getTrigrammes(Pageable pageable) {
        return trigrammeRepository.findAll(pageable);
    }
    */
    @GetMapping("/trigrammes")
    Collection<Trigramme> trigrammes() {
        return trigrammeRepository.findAll();
    }

    @GetMapping("/trigrammes/{id}")
    ResponseEntity<?> getTrigramme(@PathVariable Long id) {
        Optional<Trigramme> group = trigrammeRepository.findById(id);
        return group.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/trigrammes")
    public Trigramme createTrigramme(@Valid @RequestBody Trigramme trigramme) {
        return trigrammeRepository.save(trigramme);
    }

    @PutMapping("/trigrammes/{trigrammeId}")
    public Trigramme updateTrigramme(@PathVariable Long trigrammeId,
                                   @Valid @RequestBody Trigramme trigrammeRequest) {
        return trigrammeRepository.findById(trigrammeId)
                .map(trigramme -> {
                	trigramme.setName(trigrammeRequest.getName());
                	trigramme.setOwner(trigrammeRequest.getOwner());
                	trigramme.setDescription(trigrammeRequest.getDescription());
                	trigramme.setMailList(trigrammeRequest.getMailList());
                	trigramme.setIrtCode(trigrammeRequest.getIrtCode());
                	
                    return trigrammeRepository.save(trigramme);
                }).orElseThrow(() -> new ResourceNotFoundException("Trigramme not found with id " + trigrammeId));
    }


    @DeleteMapping("/trigrammes/{trigrammeId}")
    public ResponseEntity<?> deleteTrigramme(@PathVariable Long trigrammeId) {
        return trigrammeRepository.findById(trigrammeId)
                .map(trigramme -> {
                	trigrammeRepository.delete(trigramme);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Trigramme not found with id " + trigrammeId));
    }
}
