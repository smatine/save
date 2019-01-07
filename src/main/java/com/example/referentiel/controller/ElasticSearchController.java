package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.ElasticSearch;
import com.example.referentiel.model.Node;
import com.example.referentiel.model.Rds;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Vpc;

import com.example.referentiel.repository.ElasticSearchRepository;
import com.example.referentiel.repository.NodeRepository;
import com.example.referentiel.repository.SubnetGroupRepository;
import com.example.referentiel.repository.VpcRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@Transactional
public class ElasticSearchController {

    @Autowired
    private ElasticSearchRepository elasticSearchRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetGroupRepository subnetGroupRepository;

    @Autowired
    private NodeRepository nodeRepository;
    
    @GetMapping("/vpcs/{vpcId}/elasticSearchs")
    public List<ElasticSearch> getElasticSearchsByVpcId(@PathVariable Long vpcId) {
        return elasticSearchRepository.findByVpcId(vpcId);
    }

    @GetMapping("/elasticSearchs")
    Collection<ElasticSearch> elasticSearchs() {
    	
        Collection<ElasticSearch> elasticSearchs = elasticSearchRepository.findAll();
    	
    	Iterator<ElasticSearch> it = elasticSearchs.iterator();
		 while(it.hasNext()) {
			ElasticSearch elasticSearch = (ElasticSearch)it.next();
			SubnetGroup sb = elasticSearch.getSubnetgroup();
		 }    	
        return elasticSearchs;
    }
    
    @GetMapping("/elasticSearchs/{id}")
    ResponseEntity<?> getElasticSearch(@PathVariable Long id) {
        Optional<ElasticSearch> elasticSearch = elasticSearchRepository.findById(id);
        
        //System.out.println("elasticSearch:" +  elasticSearch.toString());
        
        return elasticSearch.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/elasticSearchs")
    public ElasticSearch addElasticSearch(@PathVariable String vpcId,
                            @Valid @RequestBody ElasticSearch elasticSearch) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	
                	Set<Node> nodes  = elasticSearch.getNodes();
                	Iterator<Node> it = nodes.iterator();
           		 	while(it.hasNext()) {
           		 		Node n = it.next();
	           		 	if(n != null && (n.getType().equals("master") || n.getType().equals("instance"))) {
	   		 				n.setElasticSearch(elasticSearch);
	   		 				elasticSearch.getNodes().add(n);
	   		 				//System.out.println("addElasticSearch=" + n.getId() + " " + n.getType());
	           		 	}
           		 	}
                	elasticSearch.setVpc(vpc);
                    return elasticSearchRepository.save(elasticSearch);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PostMapping("/elasticSearch")
    public ElasticSearch addElasticSearchPublic(
                            @Valid @RequestBody ElasticSearch elasticSearch) {
    	Set<Node> nodes  = elasticSearch.getNodes();
    	Iterator<Node> it = nodes.iterator();
	 	while(it.hasNext()) {
	 		Node n = it.next();
		 	if(n != null && (n.getType().equals("master") || n.getType().equals("instance"))) {
	 				n.setElasticSearch(elasticSearch);
	 				elasticSearch.getNodes().add(n);
	 				//System.out.println("addElasticSearch=" + n.getId() + " " + n.getType());
		 	}
	 	}
    	return elasticSearchRepository.save(elasticSearch);
    }
    
    @PutMapping("/vpcs/{vpcId}/elasticSearchs/{elasticSearchId}")
    public ElasticSearch updateElasticSearch(@PathVariable Long vpcId,
                               @PathVariable Long elasticSearchId,
                               @Valid @RequestBody ElasticSearch elasticSearchRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        Optional<SubnetGroup> sg = subnetGroupRepository.findById(elasticSearchRequest.getSubnetgroup().getId());
        
        return elasticSearchRepository.findById(elasticSearchId)
                .map(elasticSearch -> {
                	elasticSearch.setText(elasticSearchRequest.getText());
                	elasticSearch.setName(elasticSearchRequest.getName());
                	elasticSearch.setPrive(elasticSearchRequest.isPrive());
                	elasticSearch.setVpc(vpc.get());
                	elasticSearch.setAccount(elasticSearchRequest.getAccount());
                	elasticSearch.setSubnetgroup(sg.get());
                	
                	//domainName version instanceCount instanceType enableDedicatedMaster dedicatedMasterInstanceType
                	//dedicatedMasterInstanceCount enableZoneAwareness storageType 
                	//volumeType volumeSize enableEncrypt snapshotConfiguration nodeToNodeEncryption
                	
                	elasticSearch.setDomainName(elasticSearchRequest.getDomainName());
                	elasticSearch.setVersion(elasticSearchRequest.getVersion());
                	
                	/*elasticSearch.setInstanceCount(elasticSearchRequest.getInstanceCount());
                	elasticSearch.setInstanceType(elasticSearchRequest.getInstanceType());*/
                	
                	elasticSearch.setEnableDedicatedMaster(elasticSearchRequest.isEnableDedicatedMaster());
                	
                	/*elasticSearch.setDedicatedMasterInstanceType(elasticSearchRequest.getDedicatedMasterInstanceType());
                	elasticSearch.setDedicatedMasterInstanceCount(elasticSearchRequest.getDedicatedMasterInstanceCount());*/
                	
                	elasticSearch.setEnableZoneAwareness(elasticSearchRequest.isEnableZoneAwareness());
                	elasticSearch.setStorageType(elasticSearchRequest.getStorageType());
                	elasticSearch.setVolumeType(elasticSearchRequest.getVolumeType());
                	elasticSearch.setVolumeSize(elasticSearchRequest.getVolumeSize());
                	elasticSearch.setEnableEncrypt(elasticSearchRequest.isEnableEncrypt());
                	elasticSearch.setSnapshotConfiguration(elasticSearchRequest.getSnapshotConfiguration());
                	elasticSearch.setNodeToNodeEncryption(elasticSearchRequest.isNodeToNodeEncryption());
                	
                	elasticSearch.setProvisionedIops(elasticSearchRequest.getProvisionedIops());
                	
                	// AllowExplicitIndex CacheSize MaxClauseCount AccessPolicy
                	elasticSearch.setAllowExplicitIndex(elasticSearchRequest.isAllowExplicitIndex());
                	elasticSearch.setCacheSize(elasticSearchRequest.getCacheSize());
                	elasticSearch.setMaxClauseCount(elasticSearchRequest.getMaxClauseCount());
                	elasticSearch.setAccessPolicy(elasticSearchRequest.getAccessPolicy());
                	
                	Set<Node> nodes  = elasticSearch.getNodes();
                	Iterator<Node> it = nodes.iterator();
            	 	while(it.hasNext()) {
            	 		Node n = it.next();
            	 		nodeRepository.delete(n);
            	 	}
            	 	elasticSearch.getNodes().clear();
                	nodes  = elasticSearchRequest.getNodes();
                	it = nodes.iterator();
            	 	while(it.hasNext()) {
            	 		Node n = it.next();
            		 	if(n != null && (n.getType().equals("master") || n.getType().equals("instance"))) {
            	 				n.setElasticSearch(elasticSearch);
            	 				//elasticSearch.getNodes().remove(n);
            	 				//nodeRepository.delete(n);
            	 				elasticSearch.getNodes().add(n);
            	 				//System.out.println("addElasticSearch=" + n.getId() + " " + n.getType());
            		 	}
            	 	}
            	 	
                    return elasticSearchRepository.save(elasticSearch);
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticSearch not found with id " + elasticSearchId));
    }
 
    @PutMapping("/elasticSearch/{elasticSearchId}")
    public ElasticSearch updateElasticSearchPublic(
                               @PathVariable Long elasticSearchId,
                               @Valid @RequestBody ElasticSearch elasticSearchRequest) {
        
        return elasticSearchRepository.findById(elasticSearchId)
                .map(elasticSearch -> {
                	elasticSearch.setAccount(elasticSearchRequest.getAccount());
                	elasticSearch.setText(elasticSearchRequest.getText());
                	elasticSearch.setName(elasticSearchRequest.getName());
                	elasticSearch.setPrive(elasticSearchRequest.isPrive());
                	
                	elasticSearch.setDomainName(elasticSearchRequest.getDomainName());
                	elasticSearch.setVersion(elasticSearchRequest.getVersion());
                	
                	/*elasticSearch.setInstanceCount(elasticSearchRequest.getInstanceCount());
                	elasticSearch.setInstanceType(elasticSearchRequest.getInstanceType());*/
                	
                	elasticSearch.setEnableDedicatedMaster(elasticSearchRequest.isEnableDedicatedMaster());
                	
                	/*elasticSearch.setDedicatedMasterInstanceType(elasticSearchRequest.getDedicatedMasterInstanceType());
                	elasticSearch.setDedicatedMasterInstanceCount(elasticSearchRequest.getDedicatedMasterInstanceCount());*/
                	
                	elasticSearch.setEnableZoneAwareness(elasticSearchRequest.isEnableZoneAwareness());
                	elasticSearch.setStorageType(elasticSearchRequest.getStorageType());
                	elasticSearch.setVolumeType(elasticSearchRequest.getVolumeType());
                	elasticSearch.setVolumeSize(elasticSearchRequest.getVolumeSize());
                	elasticSearch.setEnableEncrypt(elasticSearchRequest.isEnableEncrypt());
                	elasticSearch.setSnapshotConfiguration(elasticSearchRequest.getSnapshotConfiguration());
                	elasticSearch.setNodeToNodeEncryption(elasticSearchRequest.isNodeToNodeEncryption());
                	
                	elasticSearch.setProvisionedIops(elasticSearchRequest.getProvisionedIops());
                	// AllowExplicitIndex CacheSize MaxClauseCount
                	elasticSearch.setAllowExplicitIndex(elasticSearchRequest.isAllowExplicitIndex());
                	elasticSearch.setCacheSize(elasticSearchRequest.getCacheSize());
                	elasticSearch.setMaxClauseCount(elasticSearchRequest.getMaxClauseCount());
                	elasticSearch.setAccessPolicy(elasticSearchRequest.getAccessPolicy());
                	
                	Set<Node> nodes  = elasticSearch.getNodes();
                	Iterator<Node> it = nodes.iterator();
            	 	while(it.hasNext()) {
            	 		Node n = it.next();
            	 		nodeRepository.delete(n);
            	 	}
            	 	elasticSearch.getNodes().clear();
                	nodes  = elasticSearchRequest.getNodes();
                	it = nodes.iterator();
            	 	while(it.hasNext()) {
            	 		Node n = it.next();
            		 	if(n != null && (n.getType().equals("master") || n.getType().equals("instance"))) {
            	 				n.setElasticSearch(elasticSearch);
            	 				
            	 				//nodeRepository.delete(n);
            	 				elasticSearch.getNodes().add(n);
            	 				//System.out.println("addElasticSearch=" + n.getId() + " " + n.getType());
            		 	}
            	 	}
                    return elasticSearchRepository.save(elasticSearch);
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticSearch not found with id " + elasticSearchId));
    }

    @DeleteMapping("/vpcs/{vpcId}/elasticSearchs/{elasticSearchId}")
    public ResponseEntity<?> deleteElasticSearch(@PathVariable Long vpcId,
                                          @PathVariable Long elasticSearchId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return elasticSearchRepository.findById(elasticSearchId)
                .map(elasticSearch -> {
                	elasticSearchRepository.delete(elasticSearch);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticSearch not found with id " + elasticSearchId));

    }
    
    @DeleteMapping("/elasticSearch/{elasticSearchId}")
    public ResponseEntity<?> deleteElasticSearchPublic(
                                          @PathVariable Long elasticSearchId) {
        
        return elasticSearchRepository.findById(elasticSearchId)
                .map(elasticSearch -> {
                	elasticSearchRepository.delete(elasticSearch);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("ElasticSearch not found with id " + elasticSearchId));

    }
}
