package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Target;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.repository.TargetRepository;
import com.example.referentiel.repository.TargetGroupRepository;

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
@Transactional
public class TargetController {

    @Autowired
    private TargetRepository targetRepository;

    @Autowired
    private TargetGroupRepository targetGroupRepository;
    

    @GetMapping("/targetGroups/{targetGroupId}/targets")
    public List<Target> getTargetsByTargetGroupId(@PathVariable Long targetGroupId) {
        return targetRepository.findByTargetGroupId(targetGroupId);
    }

    @GetMapping("/targets")
    Collection<Target> targets() {
    	Collection<Target> targets = targetRepository.findAll();  	
        return targets;
    }
    
    @GetMapping("/targets/{id}")
    ResponseEntity<?> getTarget(@PathVariable Long id) {
        Optional<Target> target = targetRepository.findById(id);
        return target.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/targetGroups/{targetGroupId}/targets")
    public Target addTarget(@PathVariable String targetGroupId,
                            @Valid @RequestBody Target target) {
    	
    	long accId = Long.valueOf(targetGroupId);
        return targetGroupRepository.findById(accId)
                .map(targetGroup -> {
                	//System.out.println("addTarget=" + targetGroup.getPort());
                	//targetGroup.setPort((long) targetGroup.getPort());
                	target.setTargetGroup(targetGroup);
                    return targetRepository.save(target);
                }).orElseThrow(() -> new ResourceNotFoundException("TargetGroup not found with id " + targetGroupId));
    }

    @PutMapping("/targetGroups/{targetGroupId}/targets/{targetId}")
    public Target updateTarget(@PathVariable Long targetGroupId,
                               @PathVariable Long targetId,
                               @Valid @RequestBody Target targetRequest) {
        if(!targetGroupRepository.existsById(targetGroupId)) {
            throw new ResourceNotFoundException("TargetGroup not found with id " + targetGroupId);
        }
        Optional<TargetGroup> targetGroup = targetGroupRepository.findById(targetGroupId);
        
        return targetRepository.findById(targetId)
                .map(target -> {           	            
                	target.setPort(targetRequest.getPort());
                	target.setEcc(targetRequest.getEcc());
                	target.setTargetGroup(targetGroup.get());
                    return targetRepository.save(target);
                }).orElseThrow(() -> new ResourceNotFoundException("Target not found with id " + targetId));
    }

    @DeleteMapping("/targetGroups/{targetGroupId}/targets/{targetId}")
    public ResponseEntity<?> deleteTarget(@PathVariable Long targetGroupId,
                                          @PathVariable Long targetId) {
        if(!targetGroupRepository.existsById(targetGroupId)) {
            throw new ResourceNotFoundException("TargetGroup not found with id " + targetGroupId);
        }
        return targetRepository.findById(targetId)
                .map(target -> {
                	targetRepository.delete(target);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Target not found with id " + targetId));

    }
}
