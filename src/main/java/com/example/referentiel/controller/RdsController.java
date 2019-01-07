package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Rds;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.RdsRepository;
import com.example.referentiel.repository.SgRepository;
import com.example.referentiel.repository.SubnetGroupRepository;
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
public class RdsController {

    @Autowired
    private RdsRepository rdsRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetGroupRepository subnetGroupRepository;
    
    @Autowired
    private SgRepository sgRepository;

    @GetMapping("/vpcs/{vpcId}/rdss")
    public List<Rds> getRdssByVpcId(@PathVariable Long vpcId) {
        return rdsRepository.findByVpcId(vpcId);
    }

    @GetMapping("/rdss")
    Collection<Rds> rdss() {
    	Collection<Rds> rdss = rdsRepository.findAll();
    	
    	/*Iterator<Rds> it = rdss.iterator();
		 while(it.hasNext()) {
			Rds rds = (Rds)it.next();
			SubnetGroup sb = rds.getSubnetgroup();
		 } */   	
        return rdss;
    }
    
    @GetMapping("/rdss/{id}")
    ResponseEntity<?> getRds(@PathVariable Long id) {
        Optional<Rds> rds = rdsRepository.findById(id);
        
        return rds.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/rdss")
    public Rds addRds(@PathVariable String vpcId,
                            @Valid @RequestBody Rds rds) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Sg> sgss = rds.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getRdss().add(rds);
    		sgs.add(ss);
    	}
    	rds.setSgs(sgs);
    	
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	rds.setVpc(vpc);
                	
                	Rds r = rdsRepository.save(rds);
                	Iterator<Sg> itgs = sgs.iterator();
                	while(itgs.hasNext()) {
                		Sg s = (Sg)itgs.next();
                		sgRepository.save(s);
                	}
                	
                    return r;
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/rdss/{rdsId}")
    public Rds updateRds(@PathVariable Long vpcId,
                               @PathVariable Long rdsId,
                               @Valid @RequestBody Rds rdsRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        //Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        //Optional<SubnetGroup> sg = subnetGroupRepository.findById(rdsRequest.getSubnetgroup().getId());
        
        List<Sg> sgss = rdsRequest.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sug = sgRepository.findById(s.getId());
    		Sg ss = sug.get();
    	    ss.getRdss().add(rdsRequest);
    		sgs.add(ss);
    	}
    	
        return rdsRepository.findById(rdsId)
                .map(rds -> {
                	Iterator<Sg> itsg = rds.getSgs().iterator();
                	while(itsg.hasNext()) {
                		Sg s = (Sg)itsg.next();
                		s.getRdss().remove(rds);
                		sgRepository.save(s);
                	}
                	rds.setText(rdsRequest.getText());
                	rds.setName(rdsRequest.getName());
                	rds.setAccount(rdsRequest.getAccount());
                	rds.setVpc(rdsRequest.getVpc());
                	rds.setSubnetgroup(rdsRequest.getSubnetgroup());
                	rds.setAz(rdsRequest.getAz());
                	rds.setInstanceType(rdsRequest.getInstanceType());
                	
                	rds.setEnv(rdsRequest.getEnv());
                	rds.setType(rdsRequest.getType());
                	rds.setDbEngineVesion(rdsRequest.getDbEngineVesion());
                	rds.setMultiAz(rdsRequest.isMultiAz());
                	rds.setStorageType(rdsRequest.getStorageType());
                	rds.setAlocatedStorage(rdsRequest.getAlocatedStorage());
                	rds.setProvisionedIops(rdsRequest.getProvisionedIops());
                	rds.setDbInstanceIdentifier(rdsRequest.getDbInstanceIdentifier());
                	rds.setMasterUserName(rdsRequest.getMasterUserName());
                	rds.setMasterPassword(rdsRequest.getMasterPassword());
                	rds.setMasterConfirmPassword(rdsRequest.getMasterConfirmPassword());
                	
                	rds.setProduct(rdsRequest.getProduct());
                	rds.setSgs(sgs);
                    return rdsRepository.save(rds);
                }).orElseThrow(() -> new ResourceNotFoundException("Rds not found with id " + rdsId));
    }

    @DeleteMapping("/vpcs/{vpcId}/rdss/{rdsId}")
    public ResponseEntity<?> deleteRds(@PathVariable Long vpcId,
                                          @PathVariable Long rdsId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return rdsRepository.findById(rdsId)
                .map(rds -> {
                	rdsRepository.delete(rds);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Rds not found with id " + rdsId));

    }
}
