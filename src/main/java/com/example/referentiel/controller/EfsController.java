package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Efs;
import com.example.referentiel.model.Rds;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.EfsRepository;
import com.example.referentiel.repository.SubnetGroupRepository;
import com.example.referentiel.repository.VpcRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class EfsController {

    @Autowired
    private EfsRepository efsRepository;

    @Autowired
    private VpcRepository vpcRepository;

    @Autowired
    private SubnetGroupRepository subnetGroupRepository;
    
    @GetMapping("/vpcs/{vpcId}/efss")
    public List<Efs> getEfssByVpcId(@PathVariable Long vpcId) {
        return efsRepository.findByVpcId(vpcId);
    }

    @GetMapping("/efss")
    Collection<Efs> efss() {
    	
    	Collection<Efs> efss = efsRepository.findAll();
    	
    	Iterator<Efs> it = efss.iterator();
		 while(it.hasNext()) {
			Efs efs = (Efs)it.next();
			SubnetGroup sb = efs.getSubnetgroup();
			//if(sb != null) System.out.println("rdddddd=" + sb.getName());
		 }    	
        return efss;
    }
    
    @GetMapping("/efss/{id}")
    ResponseEntity<?> getEfs(@PathVariable Long id) {
        Optional<Efs> efs = efsRepository.findById(id);
        
        System.out.println("efs:" +  efs.toString());
        
        return efs.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/efss")
    public Efs addEfs(@PathVariable String vpcId,
                            @Valid @RequestBody Efs efs) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	efs.setVpc(vpc);
                    return efsRepository.save(efs);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/efss/{efsId}")
    public Efs updateEfs(@PathVariable Long vpcId,
                               @PathVariable Long efsId,
                               @Valid @RequestBody Efs efsRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        Optional<SubnetGroup> sg = subnetGroupRepository.findById(efsRequest.getSubnetgroup().getId());
        
        return efsRepository.findById(efsId)
                .map(efs -> {
                	efs.setText(efsRequest.getText());
                	efs.setName(efsRequest.getName());
                	////kms kmsExterne encryption performanceMode throughputMode provisionedIo
                	efs.setKms(efsRequest.getKms());
                	efs.setKmsExterne(efsRequest.getKmsExterne());
                	efs.setEncryption(efsRequest.isEncryption());
                	efs.setEncryptionType(efsRequest.getEncryptionType());
                	efs.setPerformanceMode(efsRequest.getPerformanceMode());
                	
                	efs.setThroughputMode(efsRequest.getThroughputMode());
                	efs.setProvisionedIo(efsRequest.getProvisionedIo());
                	
                	efs.setAccount(efsRequest.getAccount());
                	efs.setVpc(vpc.get());
                	efs.setSubnetgroup(sg.get());
                	
                    return efsRepository.save(efs);
                }).orElseThrow(() -> new ResourceNotFoundException("Efs not found with id " + efsId));
    }

    @DeleteMapping("/vpcs/{vpcId}/efss/{efsId}")
    public ResponseEntity<?> deleteEfs(@PathVariable Long vpcId,
                                          @PathVariable Long efsId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return efsRepository.findById(efsId)
                .map(efs -> {
                	efsRepository.delete(efs);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Efs not found with id " + efsId));

    }
}
