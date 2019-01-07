package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Tag;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.model.AutoScalingGroup;
import com.example.referentiel.model.Dhcp;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.model.Efs;
import com.example.referentiel.model.Kms;
import com.example.referentiel.model.Lb;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Peering;
import com.example.referentiel.model.RouteTable;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Storage;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.repository.TagRepository;
import com.example.referentiel.repository.TargetGroupRepository;
import com.example.referentiel.repository.VpcRepository;
import com.example.referentiel.repository.AutoScalingGroupRepository;
import com.example.referentiel.repository.DhcpRepository;
import com.example.referentiel.repository.EccRepository;
import com.example.referentiel.repository.EfsRepository;
import com.example.referentiel.repository.KmsRepository;
import com.example.referentiel.repository.LbRepository;
import com.example.referentiel.repository.NaclRepository;
import com.example.referentiel.repository.PeeringRepository;
import com.example.referentiel.repository.RouteTableRepository;
import com.example.referentiel.repository.SgRepository;
import com.example.referentiel.repository.StorageRepository;
import com.example.referentiel.repository.SubnetRepository;

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
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private NaclRepository naclRepository;
    
    @Autowired
    private SgRepository sgRepository;
    
    @Autowired
    private RouteTableRepository routeTableRepository;
    
    @Autowired
    private PeeringRepository peeringRepository; 
    
    @Autowired
    private TargetGroupRepository targetGroupRepository;
    
    @Autowired
    private LbRepository lbRepository;
    
    @Autowired
    private EccRepository eccRepository;
    
    @Autowired
    private AutoScalingGroupRepository autoScalingGroupRepository;
    
    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;
    
    @Autowired
    private DhcpRepository dhcpRepository;
    
    @Autowired
    private StorageRepository storageRepository;
    
    @Autowired
    private KmsRepository kmsRepository;
    
    @Autowired
    private EfsRepository efsRepository;
    
    @GetMapping("/nacls/{naclId}/tags")
    public List<Tag> getTagsByNaclId(@PathVariable Long naclId) {
    	List<Tag> tags = tagRepository.findByNaclId(naclId);
    	
    	/*Iterator<Tag> itt = tags.iterator();
    	while(itt.hasNext()) {
    		Tag tag = (Tag)itt.next();
    		tag.setNacl(tag.getNacl());
    	} */
        return tags;
    }
    
    @GetMapping("/tags")
    Collection<Tag> tags() {
    	Collection<Tag> tags = tagRepository.findAll();  	
        return tags;
    }
    
    @GetMapping("/tags/{id}")
    ResponseEntity<?> getTag(@PathVariable Long id) {
        Optional<Tag> tag = tagRepository.findById(id);
           
        return tag.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/nacls/{naclId}/tags")
    public Tag addTag(@PathVariable String naclId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(naclId);
        return naclRepository.findById(accId)
                .map(nacl -> {
                	tag.setNacl(nacl);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Nacl not found with id " + naclId));
    }

    @PutMapping("/nacls/{naclId}/tags/{tagId}")
    public Tag updateTag(@PathVariable Long naclId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!naclRepository.existsById(naclId)) {
            throw new ResourceNotFoundException("Nacl not found with id " + naclId);
        }
        Optional<Nacl> nacl = naclRepository.findById(naclId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setNacl(nacl.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/nacls/{naclId}/tags/{tagId}")
    public ResponseEntity<?> deleteTag(@PathVariable Long naclId,
                                          @PathVariable Long tagId) {
        if(!naclRepository.existsById(naclId)) {
            throw new ResourceNotFoundException("Nacl not found with id " + naclId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
    // Sg
    
    @GetMapping("/sgs/{sgId}/tags")
    public List<Tag> getTagsBySgId(@PathVariable Long sgId) {
        return tagRepository.findBySgId(sgId);
    }
    
    @PostMapping("/sgs/{sgId}/tags")
    public Tag addTagSg(@PathVariable String sgId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(sgId);
        return sgRepository.findById(accId)
                .map(sg -> {
                	tag.setSg(sg);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Sg not found with id " + sgId));
    }

    @PutMapping("/sgs/{sgId}/tags/{tagId}")
    public Tag updateTagSg(@PathVariable Long sgId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!sgRepository.existsById(sgId)) {
            throw new ResourceNotFoundException("Sg not found with id " + sgId);
        }
        Optional<Sg> sg = sgRepository.findById(sgId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setSg(sg.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/sgs/{sgId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagSg(@PathVariable Long sgId,
                                          @PathVariable Long tagId) {
        if(!sgRepository.existsById(sgId)) {
            throw new ResourceNotFoundException("Sg not found with id " + sgId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
    //routetable
    
    @GetMapping("/routeTables/{routetableId}/tags")
    public List<Tag> getTagsByRoutetableId(@PathVariable Long routetableId) {
        return tagRepository.findByRouteTableId(routetableId);
    }
    
    @PostMapping("/routeTables/{routetableId}/tags")
    public Tag addTagRoutetable(@PathVariable String routetableId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(routetableId);
        return routeTableRepository.findById(accId)
                .map(routetable -> {
                	tag.setRouteTable(routetable);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Routetable not found with id " + routetableId));
    }

    @PutMapping("/routeTables/{routetableId}/tags/{tagId}")
    public Tag updateTagRoutetable(@PathVariable Long routetableId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!routeTableRepository.existsById(routetableId)) {
            throw new ResourceNotFoundException("Routetable not found with id " + routetableId);
        }
        Optional<RouteTable> routetable = routeTableRepository.findById(routetableId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setRouteTable(routetable.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/routeTables/{routetableId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagRoutetable(@PathVariable Long routetableId,
                                          @PathVariable Long tagId) {
        if(!routeTableRepository.existsById(routetableId)) {
            throw new ResourceNotFoundException("Routetable not found with id " + routetableId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
    
 //peering
    
    @GetMapping("/peerings/{peeringId}/tags")
    public List<Tag> getTagsByPeeringId(@PathVariable Long peeringId) {
    	
    	/*List<Tag> lTags = tagRepository.findByPeeringId(peeringId);
    	Iterator<Tag> itt = lTags.iterator();
    	while(itt.hasNext()) {
    		Tag tag = (Tag)itt.next();
    		Peering peering = tag.getPeering();
    		System.out.println("getTagsByPeeringId:" + "tag:" + tag.getKey() + " :peering" + peering.getId());
    	} */
        return tagRepository.findByPeeringId(peeringId);
    }
    
    @PostMapping("/peerings/{peeringId}/tags")
    public Tag addTagPeering(@PathVariable String peeringId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(peeringId);
        return peeringRepository.findById(accId)
                .map(peering -> {
                	tag.setPeering(peering);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("peering not found with id " + peeringId));
    }

    @PutMapping("/peerings/{peeringId}/tags/{tagId}")
    public Tag updateTagPeering(@PathVariable Long peeringId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!peeringRepository.existsById(peeringId)) {
            throw new ResourceNotFoundException("peering not found with id " + peeringId);
        }
        Optional<Peering> peering = peeringRepository.findById(peeringId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setPeering(peering.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/peerings/{peeringId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagPeering(@PathVariable Long peeringId,
                                          @PathVariable Long tagId) {
        if(!peeringRepository.existsById(peeringId)) {
            throw new ResourceNotFoundException("peering not found with id " + peeringId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }

    
//targetgroup
    
    @GetMapping("/targetGroups/{targetGroupId}/tags")
    public List<Tag> getTagsByTargetGroupId(@PathVariable Long targetGroupId) {
    	
        return tagRepository.findByTargetGroupId(targetGroupId);
    }
    
    @PostMapping("/targetGroups/{targetGroupId}/tags")
    public Tag addTagTargetGroup(@PathVariable String targetGroupId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(targetGroupId);
        return targetGroupRepository.findById(accId)
                .map(targetGroup -> {
                	tag.setTargetGroup(targetGroup);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("targetGroup not found with id " + targetGroupId));
    }

    @PutMapping("/targetGroups/{targetGroupId}/tags/{tagId}")
    public Tag updateTagTargetGroup(@PathVariable Long targetGroupId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!targetGroupRepository.existsById(targetGroupId)) {
            throw new ResourceNotFoundException("targetGroup not found with id " + targetGroupId);
        }
        Optional<TargetGroup> targetGroup = targetGroupRepository.findById(targetGroupId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setTargetGroup(targetGroup.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/targetGroups/{targetGroupId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagTargetGroup(@PathVariable Long targetGroupId,
                                          @PathVariable Long tagId) {
        if(!targetGroupRepository.existsById(targetGroupId)) {
            throw new ResourceNotFoundException("targetGroup not found with id " + targetGroupId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
//lb
    
    @GetMapping("/lbs/{lbId}/tags")
    public List<Tag> getTagsByLbId(@PathVariable Long lbId) {
    	
        return tagRepository.findByLbId(lbId);
    }
    
    @PostMapping("/lbs/{lbId}/tags")
    public Tag addTagLb(@PathVariable String lbId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(lbId);
        return lbRepository.findById(accId)
                .map(lb -> {
                	tag.setLb(lb);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("lb not found with id " + lbId));
    }

    @PutMapping("/lbs/{lbId}/tags/{tagId}")
    public Tag updateTagLb(@PathVariable Long lbId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!lbRepository.existsById(lbId)) {
            throw new ResourceNotFoundException("lb not found with id " + lbId);
        }
        Optional<Lb> lb = lbRepository.findById(lbId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setLb(lb.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/lbs/{lbId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagLb(@PathVariable Long lbId,
                                          @PathVariable Long tagId) {
        if(!lbRepository.existsById(lbId)) {
            throw new ResourceNotFoundException("lb not found with id " + lbId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }

    
//ecc
    
    @GetMapping("/eccs/{eccId}/tags")
    public List<Tag> getTagsByEccId(@PathVariable Long eccId) {
    	
        return tagRepository.findByEccId(eccId);
    }
    
    @PostMapping("/eccs/{eccId}/tags")
    public Tag addTagEcc(@PathVariable String eccId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(eccId);
        return eccRepository.findById(accId)
                .map(ecc -> {
                	tag.setEcc(ecc);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("ecc not found with id " + eccId));
    }

    @PutMapping("/eccs/{eccId}/tags/{tagId}")
    public Tag updateTagEcc(@PathVariable Long eccId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("ecc not found with id " + eccId);
        }
        Optional<Ecc> ecc = eccRepository.findById(eccId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setEcc(ecc.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/eccs/{eccId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagEcc(@PathVariable Long eccId,
                                          @PathVariable Long tagId) {
        if(!eccRepository.existsById(eccId)) {
            throw new ResourceNotFoundException("ecc not found with id " + eccId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
//autoscalinggroup
    
    @GetMapping("/autoScalingGroups/{autoScalingGroupId}/tags")
    public List<Tag> getTagsByAutoScalingGroupId(@PathVariable Long autoScalingGroupId) {
    	
        return tagRepository.findByAutoScalingGroupId(autoScalingGroupId);
    }
    
    @PostMapping("/autoScalingGroups/{autoScalingGroupId}/tags")
    public Tag addTagAutoScalingGroup(@PathVariable String autoScalingGroupId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(autoScalingGroupId);
        return autoScalingGroupRepository.findById(accId)
                .map(autoScalingGroup -> {
                	tag.setAutoScalingGroup(autoScalingGroup);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("autoScalingGroup not found with id " + autoScalingGroupId));
    }

    @PutMapping("/autoScalingGroups/{autoScalingGroupId}/tags/{tagId}")
    public Tag updateTagAutoScalingGroup(@PathVariable Long autoScalingGroupId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!autoScalingGroupRepository.existsById(autoScalingGroupId)) {
            throw new ResourceNotFoundException("autoScalingGroup not found with id " + autoScalingGroupId);
        }
        Optional<AutoScalingGroup> autoScalingGroup = autoScalingGroupRepository.findById(autoScalingGroupId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setAutoScalingGroup(autoScalingGroup.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/autoScalingGroups/{autoScalingGroupId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagAutoScalingGroup(@PathVariable Long autoScalingGroupId,
                                          @PathVariable Long tagId) {
        if(!autoScalingGroupRepository.existsById(autoScalingGroupId)) {
            throw new ResourceNotFoundException("autoScalingGroup not found with id " + autoScalingGroupId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }

//vpc
    
    @GetMapping("/vpcs/{vpcId}/tags")
    public List<Tag> getTagsByVpcId(@PathVariable Long vpcId) {
    	
        return tagRepository.findByVpcId(vpcId);
    }
    
    @PostMapping("/vpcs/{vpcId}/tags")
    public Tag addTagVpc(@PathVariable String vpcId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	tag.setVpc(vpc);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/tags/{tagId}")
    public Tag updateTagVpc(@PathVariable Long vpcId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setVpc(vpc.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/vpcs/{vpcId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagVpc(@PathVariable Long vpcId,
                                          @PathVariable Long tagId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("vpc not found with id " + vpcId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }


//subnet
    
    @GetMapping("/subnets/{subnetId}/tags")
    public List<Tag> getTagsBySubnetId(@PathVariable Long subnetId) {
    	
        return tagRepository.findBySubnetId(subnetId);
    }
    
    @PostMapping("/subnets/{subnetId}/tags")
    public Tag addTagSubnet(@PathVariable String subnetId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(subnetId);
        return subnetRepository.findById(accId)
                .map(subnet -> {
                	tag.setSubnet(subnet);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("subnet not found with id " + subnetId));
    }

    @PutMapping("/subnets/{subnetId}/tags/{tagId}")
    public Tag updateTagSubnet(@PathVariable Long subnetId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!subnetRepository.existsById(subnetId)) {
            throw new ResourceNotFoundException("subnet not found with id " + subnetId);
        }
        Optional<Subnet> subnet = subnetRepository.findById(subnetId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setSubnet(subnet.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/subnets/{subnetId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagSubnet(@PathVariable Long subnetId,
                                          @PathVariable Long tagId) {
        if(!subnetRepository.existsById(subnetId)) {
            throw new ResourceNotFoundException("subnet not found with id " + subnetId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
//dhcp
    
    @GetMapping("/dhcps/{dhcpId}/tags")
    public List<Tag> getTagsByDhcpId(@PathVariable Long dhcpId) {
    	
        return tagRepository.findByDhcpId(dhcpId);
    }
    
    @PostMapping("/dhcps/{dhcpId}/tags")
    public Tag addTagDhcp(@PathVariable String dhcpId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(dhcpId);
        return dhcpRepository.findById(accId)
                .map(dhcp -> {
                	tag.setDhcp(dhcp);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("dhcp not found with id " + dhcpId));
    }

    @PutMapping("/dhcps/{dhcpId}/tags/{tagId}")
    public Tag updateTagDhcp(@PathVariable Long dhcpId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!dhcpRepository.existsById(dhcpId)) {
            throw new ResourceNotFoundException("dhcp not found with id " + dhcpId);
        }
        Optional<Dhcp> dhcp = dhcpRepository.findById(dhcpId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setDhcp(dhcp.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/dhcps/{dhcpId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagDhcp(@PathVariable Long dhcpId,
                                          @PathVariable Long tagId) {
        if(!dhcpRepository.existsById(dhcpId)) {
            throw new ResourceNotFoundException("dhcp not found with id " + dhcpId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }


//storage
    
    @GetMapping("/storages/{storageId}/tags")
    public List<Tag> getTagsByStorageId(@PathVariable Long storageId) {
    	
        return tagRepository.findByStorageId(storageId);
    }
    
    @PostMapping("/storages/{storageId}/tags")
    public Tag addTagStorage(@PathVariable String storageId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(storageId);
        return storageRepository.findById(accId)
                .map(storage -> {
                	tag.setStorage(storage);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("storage not found with id " + storageId));
    }

    @PutMapping("/storages/{storageId}/tags/{tagId}")
    public Tag updateTagStorage(@PathVariable Long storageId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!storageRepository.existsById(storageId)) {
            throw new ResourceNotFoundException("storage not found with id " + storageId);
        }
        Optional<Storage> storage = storageRepository.findById(storageId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setStorage(storage.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/storages/{storageId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagStorage(@PathVariable Long storageId,
                                          @PathVariable Long tagId) {
        if(!storageRepository.existsById(storageId)) {
            throw new ResourceNotFoundException("storage not found with id " + storageId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
//kms
    
    @GetMapping("/kmss/{kmsId}/tags")
    public List<Tag> getTagsByKmsId(@PathVariable Long kmsId) {
    	
        return tagRepository.findByKmsId(kmsId);
    }
    
    @PostMapping("/kmss/{kmsId}/tags")
    public Tag addTagKms(@PathVariable String kmsId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(kmsId);
        return kmsRepository.findById(accId)
                .map(kms -> {
                	tag.setKms(kms);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("kms not found with id " + kmsId));
    }

    @PutMapping("/kmss/{kmsId}/tags/{tagId}")
    public Tag updateTagKms(@PathVariable Long kmsId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!kmsRepository.existsById(kmsId)) {
            throw new ResourceNotFoundException("kms not found with id " + kmsId);
        }
        Optional<Kms> kms = kmsRepository.findById(kmsId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setKms(kms.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/kmss/{kmsId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagKms(@PathVariable Long kmsId,
                                          @PathVariable Long tagId) {
        if(!kmsRepository.existsById(kmsId)) {
            throw new ResourceNotFoundException("kms not found with id " + kmsId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }
    
    
//efs
    
    @GetMapping("/efss/{efsId}/tags")
    public List<Tag> getTagsByEfsId(@PathVariable Long efsId) {
    	
        return tagRepository.findByEfsId(efsId);
    }
    
    @PostMapping("/efss/{efsId}/tags")
    public Tag addTagEfs(@PathVariable String efsId,
                            @Valid @RequestBody Tag tag) {
    	
    	long accId = Long.valueOf(efsId);
        return efsRepository.findById(accId)
                .map(efs -> {
                	tag.setEfs(efs);
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("efs not found with id " + efsId));
    }

    @PutMapping("/efss/{efsId}/tags/{tagId}")
    public Tag updateTagEfs(@PathVariable Long efsId,
                               @PathVariable Long tagId,
                               @Valid @RequestBody Tag tagRequest) {
        if(!efsRepository.existsById(efsId)) {
            throw new ResourceNotFoundException("efs not found with id " + efsId);
        }
        Optional<Efs> efs = efsRepository.findById(efsId);
        
        return tagRepository.findById(tagId)
                .map(tag -> {
                	tag.setText(tagRequest.getText());
                	tag.setKey(tagRequest.getKey());
                	tag.setValue(tagRequest.getValue());
                	tag.setEfs(efs.get());
                	
                    return tagRepository.save(tag);
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));
    }

    @DeleteMapping("/efss/{efsId}/tags/{tagId}")
    public ResponseEntity<?> deleteTagEfs(@PathVariable Long efsId,
                                          @PathVariable Long tagId) {
        if(!efsRepository.existsById(efsId)) {
            throw new ResourceNotFoundException("efs not found with id " + efsId);
        }

        return tagRepository.findById(tagId)
                .map(tag -> {
                	tagRepository.delete(tag);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId));

    }


}
