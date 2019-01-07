package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Efs;
import com.example.referentiel.model.ElasticCache;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.ElasticCacheRepository;
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
public class ElasticCacheController {

    @Autowired
    private ElasticCacheRepository elasticCacheRepository;

    @Autowired
    private VpcRepository vpcRepository;

    @Autowired
    private SubnetGroupRepository subnetGroupRepository;
    
    @Autowired
    private SgRepository sgRepository;
    
    @GetMapping("/vpcs/{vpcId}/elasticCaches")
    public List<ElasticCache> getElasticCachesByVpcId(@PathVariable Long vpcId) {
        return elasticCacheRepository.findByVpcId(vpcId);
    }

    @GetMapping("/elasticCaches")
    Collection<ElasticCache> elasticCaches() {
    	
        //return elasticCacheRepository.findAll();
        Collection<ElasticCache> elasticCaches = elasticCacheRepository.findAll();
    	
    	/*Iterator<ElasticCache> it = elasticCaches.iterator();
		 while(it.hasNext()) {
			 ElasticCache elasticCache = (ElasticCache)it.next();
			SubnetGroup sb = elasticCache.getSubnetgroup();
		 }*/ 	
        return elasticCaches;
    }
    
    @GetMapping("/elasticCaches/{id}")
    ResponseEntity<?> getElasticCache(@PathVariable Long id) {
        Optional<ElasticCache> elasticCache = elasticCacheRepository.findById(id);
        
        return elasticCache.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/elasticCaches")
    public ElasticCache addElasticCache(@PathVariable String vpcId,
                            @Valid @RequestBody ElasticCache elasticCache) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Sg> sgss = elasticCache.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    		Sg ss = sg.get();
    	    ss.getElasticaches().add(elasticCache);
    		sgs.add(ss);
    	}
    	elasticCache.setSgs(sgs);
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	elasticCache.setVpc(vpc);
                	ElasticCache e = elasticCacheRepository.save(elasticCache);
                	
                	Iterator<Sg> itgs = sgs.iterator();
                	while(itgs.hasNext()) {
                		Sg s = (Sg)itgs.next();
                		sgRepository.save(s);
                	}
                	
                    return e;
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/elasticCaches/{elasticCacheId}")
    public ElasticCache updateElasticCache(@PathVariable Long vpcId,
                               @PathVariable Long elasticCacheId,
                               @Valid @RequestBody ElasticCache elasticCacheRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        Optional<SubnetGroup> sg = subnetGroupRepository.findById(elasticCacheRequest.getSubnetgroup().getId());
        List<Sg> sgss = elasticCacheRequest.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sug = sgRepository.findById(s.getId());
    		Sg ss = sug.get();
    	    ss.getElasticaches().add(elasticCacheRequest);
    		sgs.add(ss);
    	}
        return elasticCacheRepository.findById(elasticCacheId)
                .map(elasticCache -> {
                	Iterator<Sg> itsg = elasticCache.getSgs().iterator();
                	while(itsg.hasNext()) {
                		Sg s = (Sg)itsg.next();
                		s.getElasticaches().remove(elasticCache);
                		sgRepository.save(s);
                	}
                	elasticCache.setText(elasticCacheRequest.getText());
                	elasticCache.setName(elasticCacheRequest.getName());
                	
                	elasticCache.setVpc(vpc.get());
                	elasticCache.setSubnetgroup(sg.get());
                	
                	elasticCache.setSgs(sgs);
                    return elasticCacheRepository.save(elasticCache);
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticCache not found with id " + elasticCacheId));
    }

    @DeleteMapping("/vpcs/{vpcId}/elasticCaches/{elasticCacheId}")
    public ResponseEntity<?> deleteElasticCache(@PathVariable Long vpcId,
                                          @PathVariable Long elasticCacheId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return elasticCacheRepository.findById(elasticCacheId)
                .map(elasticCache -> {
                	elasticCacheRepository.delete(elasticCache);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticCache not found with id " + elasticCacheId));

    }
}
