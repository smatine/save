package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Listener;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.model.Lb;
import com.example.referentiel.repository.ListenerRepository;
import com.example.referentiel.repository.TargetGroupRepository;
import com.example.referentiel.repository.LbRepository;

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
public class ListenerController {

    @Autowired
    private ListenerRepository listenerRepository;

    @Autowired
    private LbRepository lbRepository;
    
    @Autowired
    private TargetGroupRepository targetGroupRepository;
    
    @GetMapping("/lbs/{lbId}/listeners")
    public List<Listener> getListenersByLbId(@PathVariable Long lbId) {
        return listenerRepository.findByLbId(lbId);
    }

    @GetMapping("/listeners")
    Collection<Listener> listeners() {
    	Collection<Listener> listeners = listenerRepository.findAll();  	
        return listeners;
    }
    
    @GetMapping("/listeners/{id}")
    ResponseEntity<?> getListener(@PathVariable Long id) {
        Optional<Listener> listener = listenerRepository.findById(id);
        
        return listener.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/lbs/{lbId}/listeners")
    public Listener addListener(@PathVariable String lbId,
                            @Valid @RequestBody Listener listener) {
    	
    	long accId = Long.valueOf(lbId);
    	
    	Optional<TargetGroup> targetGroup = targetGroupRepository.findById(listener.getTargetGroup().getId());
    	
        return lbRepository.findById(accId)
                .map(lb -> {
                	listener.setTargetGroup(targetGroup.get());
                	listener.setLb(lb);
                    return listenerRepository.save(listener);
                }).orElseThrow(() -> new ResourceNotFoundException("Lb not found with id " + lbId));
    }

    @PutMapping("/lbs/{lbId}/listeners/{listenerId}")
    public Listener updateListener(@PathVariable Long lbId,
                               @PathVariable Long listenerId,
                               @Valid @RequestBody Listener listenerRequest) {
        if(!lbRepository.existsById(lbId)) {
            throw new ResourceNotFoundException("Lb not found with id " + lbId);
        }
        Optional<Lb> lb = lbRepository.findById(lbId);
        //Optional<TargetGroup> targetGroup = targetGroupRepository.findById(listenerRequest.getTargetGroup().getId());
        
        return listenerRepository.findById(listenerId)
                .map(listener -> {
                	listener.setPort(listenerRequest.getPort());
                	
                	listener.setProtocole(listenerRequest.getProtocole());
                	listener.setTargetGroup(listenerRequest.getTargetGroup());
                	listener.setLb(lb.get());
                	
                    return listenerRepository.save(listener);
                }).orElseThrow(() -> new ResourceNotFoundException("Listener not found with id " + listenerId));
    }

    @DeleteMapping("/lbs/{lbId}/listeners/{listenerId}")
    public ResponseEntity<?> deleteListener(@PathVariable Long lbId,
                                          @PathVariable Long listenerId) {
        if(!lbRepository.existsById(lbId)) {
            throw new ResourceNotFoundException("Lb not found with id " + lbId);
        }

        return listenerRepository.findById(listenerId)
                .map(listener -> {
                	
                	/*Optional<TargetGroup> targetGroup = targetGroupRepository.findById(listener.getTargetGroup().getId());
                	targetGroup.get().setListener(null);
                	targetGroupRepository.save(targetGroup.get());*/
                	
                	listenerRepository.delete(listener);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Listener not found with id " + listenerId));

    }
}
