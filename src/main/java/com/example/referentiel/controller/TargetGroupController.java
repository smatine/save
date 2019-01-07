package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Listener;
import com.example.referentiel.model.SubnetCidr;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.model.Vpc;

import com.example.referentiel.repository.ListenerRepository;
import com.example.referentiel.repository.TargetGroupRepository;
import com.example.referentiel.repository.VpcRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class TargetGroupController {

    @Autowired
    private TargetGroupRepository targetGroupRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private ListenerRepository listenerRepository;

    @GetMapping("/vpcs/{vpcId}/listeners/{listenerId}/targetGroups")
    public List<TargetGroup> getTargetGroupsByVpcIdAndListeners(
    		@PathVariable Long vpcId,
    		@PathVariable Long listenerId) {
    	
    	List<TargetGroup> targetGroups = targetGroupRepository.findByVpcId(vpcId);
    	List<TargetGroup> tgs = new ArrayList<TargetGroup>();
    	
    	Optional<Listener> listener = null;
    	if(!listenerId.equals((long) -1)) listener = listenerRepository.findById(listenerId);
    	
    	for(int i = 0; i< targetGroups.size();i++) {
    		TargetGroup tg = targetGroups.get(i);
    		
    		if(tg.getListener() == null) {
    			tgs.add(tg);
    		}else if(!listenerId.equals((long) -1) && listener.get().getTargetGroup() != null &&
    				tg.getListener().getTargetGroup().getId().longValue() == listener.get().getTargetGroup().getId().longValue())
    		{
    			tgs.add(tg);
    		}
    	}
        return tgs;
    }
    
    @GetMapping("/vpcs/{vpcId}/targetGroups")
    public List<TargetGroup> getTargetGroupsByVpcId(@PathVariable Long vpcId) {
        return targetGroupRepository.findByVpcId(vpcId);
    }

    @GetMapping("/targetGroups")
    Collection<TargetGroup> targetGroups() {
    	Collection<TargetGroup> targetGroups = targetGroupRepository.findAll();  	
        return targetGroups;
    }
    
    @GetMapping("/targetGroups/{id}")
    ResponseEntity<?> getTargetGroup(@PathVariable Long id) {
        Optional<TargetGroup> targetGroup = targetGroupRepository.findById(id);
        
        return targetGroup.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/targetGroups")
    public TargetGroup addTargetGroup(@PathVariable String vpcId,
                            @Valid @RequestBody TargetGroup targetGroup) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	targetGroup.setVpc(vpc);
                    return targetGroupRepository.save(targetGroup);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/targetGroups/{targetGroupId}")
    public TargetGroup updateTargetGroup(@PathVariable Long vpcId,
                               @PathVariable Long targetGroupId,
                               @Valid @RequestBody TargetGroup targetGroupRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        
        return targetGroupRepository.findById(targetGroupId)
                .map(targetGroup -> {
                	targetGroup.setName(targetGroupRequest.getName());
                	targetGroup.setText(targetGroupRequest.getText());
                	            
                	targetGroup.setProtocole(targetGroupRequest.getProtocole());
                	targetGroup.setPort(targetGroupRequest.getPort());
        
                	targetGroup.setType(targetGroupRequest.getType());
                	targetGroup.setHcprotocole(targetGroupRequest.getHcprotocole());
                	targetGroup.setHcpath(targetGroupRequest.getHcpath());
                	targetGroup.setAhportoverride(targetGroupRequest.isAhportoverride());
                	targetGroup.setAhport(targetGroupRequest.getAhport());
                	targetGroup.setAhhealthythreshold(targetGroupRequest.getAhhealthythreshold());
                	targetGroup.setAhuhealthythreshold(targetGroupRequest.getAhuhealthythreshold());
                	targetGroup.setAhtimeout(targetGroupRequest.getAhtimeout());
                	targetGroup.setAhsucesscode(targetGroupRequest.getAhsucesscode());
                	targetGroup.setAhtinterval(targetGroupRequest.getAhtinterval());
                	
                	targetGroup.setDeregistrationDelay(targetGroupRequest.getDeregistrationDelay());
                	targetGroup.setShortStartDuration(targetGroupRequest.getShortStartDuration());
                	targetGroup.setStickySession(targetGroupRequest.isStickySession());
                	
                	
                	if(targetGroupRequest.getListener() != null) {
                		Optional<Listener> listener = listenerRepository.findById(targetGroupRequest.getListener().getId());
                		targetGroup.setListener(listener.get());
                	}
                	targetGroup.setVpc(vpc.get());
                	targetGroup.setAccount(targetGroupRequest.getAccount());
                	
                    return targetGroupRepository.save(targetGroup);
                }).orElseThrow(() -> new ResourceNotFoundException("TargetGroup not found with id " + targetGroupId));
    }

    @DeleteMapping("/vpcs/{vpcId}/targetGroups/{targetGroupId}")
    public ResponseEntity<?> deleteTargetGroup(@PathVariable Long vpcId,
                                          @PathVariable Long targetGroupId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return targetGroupRepository.findById(targetGroupId)
                .map(targetGroup -> {
                	targetGroupRepository.delete(targetGroup);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("TargetGroup not found with id " + targetGroupId));

    }
}
