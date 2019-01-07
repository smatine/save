package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.AutoScalingGroup;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.AutoScalingGroupRepository;
import com.example.referentiel.repository.SubnetRepository;
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
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class AutoScalingGroupController {

    @Autowired
    private AutoScalingGroupRepository autoScalingGroupRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;
    
    @Autowired
    private TargetGroupRepository targetGroupRepository;

    @GetMapping("/vpcs/{vpcId}/autoScalingGroups")
    public List<AutoScalingGroup> getAutoScalingGroupsByVpcId(@PathVariable Long vpcId) {
        return autoScalingGroupRepository.findByVpcId(vpcId);
    }

    @GetMapping("/autoScalingGroups")
    Collection<AutoScalingGroup> autoScalingGroups() {
    	Collection<AutoScalingGroup> autoScalingGroups = autoScalingGroupRepository.findAll();  	
        return autoScalingGroups;
    }
    
    @GetMapping("/autoScalingGroups/{id}")
    ResponseEntity<?> getAutoScalingGroup(@PathVariable Long id) {
        Optional<AutoScalingGroup> autoScalingGroup = autoScalingGroupRepository.findById(id);
        
        Iterator<Subnet> itt = autoScalingGroup.get().getSubnets().iterator();
    	while(itt.hasNext()) {
    		Subnet sbb = (Subnet)itt.next();
    	} 
    	
        return autoScalingGroup.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/autoScalingGroups")
    public AutoScalingGroup addAutoScalingGroup(@PathVariable String vpcId,
                            @Valid @RequestBody AutoScalingGroup autoScalingGroup) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Subnet> subs = autoScalingGroup.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getAutoScalingGroups().add(autoScalingGroup);
    		subnets.add(subnet.get());
    	}
    	
    	List<TargetGroup> tGroups = autoScalingGroup.getTargetGroups();
    	List<TargetGroup> targetGroups = new ArrayList<>();
    	Iterator<TargetGroup> ittg = tGroups.iterator();
    	while(ittg.hasNext()) {
    		TargetGroup tg = (TargetGroup)ittg.next();
    		Optional<TargetGroup> targetGroup = targetGroupRepository.findById(tg.getId());
    		targetGroup.get().getAutoScalingGroups().add(autoScalingGroup);
    		targetGroups.add(targetGroup.get());
    	}
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	
                	autoScalingGroup.setSubnets(subnets);
                	autoScalingGroup.setTargetGroups(targetGroups);
                	autoScalingGroup.setVpc(vpc);
                	
                	
                	autoScalingGroup.setName(autoScalingGroup.getName());
                 	autoScalingGroup.setLaunchConfiguration(autoScalingGroup.getLaunchConfiguration());
                 	autoScalingGroup.setGroupSize(autoScalingGroup.getGroupSize());
                 	autoScalingGroup.setLoadBalancing(autoScalingGroup.isLoadBalancing());
                 	
                 	
                 	autoScalingGroup.setHealthCheckType(autoScalingGroup.getHealthCheckType());
                 	autoScalingGroup.setHealthCheckGracePeriod(autoScalingGroup.getHealthCheckGracePeriod());
                 	autoScalingGroup.setInstanceProtection(autoScalingGroup.getInstanceProtection());
                 	autoScalingGroup.setServiceLinkedRole(autoScalingGroup.getServiceLinkedRole());
                 	autoScalingGroup.setCreateAutoScalingGroup(autoScalingGroup.isCreateAutoScalingGroup());
                	
                	AutoScalingGroup na = autoScalingGroupRepository.save(autoScalingGroup);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                	Iterator<TargetGroup> itg = targetGroups.iterator();
                	while(itg.hasNext()) {
                		TargetGroup tg = (TargetGroup)itg.next();
                		targetGroupRepository.save(tg);
                	}
                    return na;
                	
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/autoScalingGroups/{autoScalingGroupId}")
    public AutoScalingGroup updateAutoScalingGroup(@PathVariable Long vpcId,
                               @PathVariable Long autoScalingGroupId,
                               @Valid @RequestBody AutoScalingGroup autoScalingGroupRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);

        List<Subnet> subs = autoScalingGroupRequest.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getAutoScalingGroups().add(autoScalingGroupRequest);
    		subnets.add(subnet.get());
    	}
    	
    	List<TargetGroup> tGroups = autoScalingGroupRequest.getTargetGroups();
    	List<TargetGroup> targetGroups = new ArrayList<>();
    	Iterator<TargetGroup> ittg = tGroups.iterator();
    	while(ittg.hasNext()) {
    		TargetGroup tg = (TargetGroup)ittg.next();
    		Optional<TargetGroup> targetGroup = targetGroupRepository.findById(tg.getId());
    		targetGroup.get().getAutoScalingGroups().add(autoScalingGroupRequest);
    		targetGroups.add(targetGroup.get());
    	}
    
        return autoScalingGroupRepository.findById(autoScalingGroupId)
                .map(autoScalingGroup -> {
                	
                	Iterator<Subnet> iti = autoScalingGroup.getSubnets().iterator();
                	while(iti.hasNext()) {
                		Subnet sbb = (Subnet)iti.next();
                		sbb.getAutoScalingGroups().remove(autoScalingGroup);
                		subnetRepository.save(sbb);
                	}
                	Iterator<TargetGroup> ittgs = autoScalingGroup.getTargetGroups().iterator();
                	while(ittgs.hasNext()) {
                		TargetGroup tg = (TargetGroup)ittgs.next();
                		tg.getAutoScalingGroups().remove(autoScalingGroup);
                		targetGroupRepository.save(tg);
                	}
                	
                	autoScalingGroup.setName(autoScalingGroupRequest.getName());
                 	autoScalingGroup.setLaunchConfiguration(autoScalingGroupRequest.getLaunchConfiguration());
                 	autoScalingGroup.setGroupSize(autoScalingGroupRequest.getGroupSize());
                 	autoScalingGroup.setLoadBalancing(autoScalingGroupRequest.isLoadBalancing());
                 	
                 	
                 	autoScalingGroup.setHealthCheckType(autoScalingGroupRequest.getHealthCheckType());
                 	autoScalingGroup.setHealthCheckGracePeriod(autoScalingGroupRequest.getHealthCheckGracePeriod());
                 	autoScalingGroup.setInstanceProtection(autoScalingGroupRequest.getInstanceProtection());
                 	autoScalingGroup.setServiceLinkedRole(autoScalingGroupRequest.getServiceLinkedRole());
                 	autoScalingGroup.setCreateAutoScalingGroup(autoScalingGroupRequest.isCreateAutoScalingGroup());
                 	
                	autoScalingGroup.setSubnets(subnets);
                	autoScalingGroup.setTargetGroups(targetGroups);
                	autoScalingGroup.setVpc(vpc.get());
                	autoScalingGroup.setAccount(autoScalingGroupRequest.getAccount());
                	
                	AutoScalingGroup na = autoScalingGroupRepository.save(autoScalingGroup);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                	Iterator<TargetGroup> itg = targetGroups.iterator();
                	while(itg.hasNext()) {
                		TargetGroup tg = (TargetGroup)itg.next();
                		targetGroupRepository.save(tg);
                	}
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("AutoScalingGroup not found with id " + autoScalingGroupId));
    }

    @DeleteMapping("/vpcs/{vpcId}/autoScalingGroups/{autoScalingGroupId}")
    public ResponseEntity<?> deleteAutoScalingGroup(@PathVariable Long vpcId,
                                          @PathVariable Long autoScalingGroupId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return autoScalingGroupRepository.findById(autoScalingGroupId)
                .map(autoScalingGroup -> {
                	
                	Iterator<Subnet> itt = autoScalingGroup.getSubnets().iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		sbb.getAutoScalingGroups().remove(autoScalingGroup);
                		subnetRepository.save(sbb);
                	}
                	Iterator<TargetGroup> itg = autoScalingGroup.getTargetGroups().iterator();
                	while(itg.hasNext()) {
                		TargetGroup tg = (TargetGroup)itg.next();
                		tg.getAutoScalingGroups().remove(autoScalingGroup);
                		targetGroupRepository.save(tg);
                	}
                	autoScalingGroupRepository.delete(autoScalingGroup);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("AutoScalingGroup not found with id " + autoScalingGroupId));

    }
}
