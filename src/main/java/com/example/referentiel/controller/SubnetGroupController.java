package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Az;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.SubnetCidr;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.AzRepository;
import com.example.referentiel.repository.SubnetCidrRepository;
import com.example.referentiel.repository.SubnetGroupRepository;
import com.example.referentiel.repository.SubnetRepository;
import com.example.referentiel.repository.VpcRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class SubnetGroupController {

    @Autowired
    private SubnetGroupRepository subnetGroupRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;

    @Autowired
    private SubnetCidrRepository subnetCidrRepository;

    @Autowired
    private AzRepository azRepository;

    @GetMapping("/vpcs/{vpcId}/type/{type}/subnetGroups")
    public List<SubnetGroup> getSubnetGroupsByVpcIdAndType(@PathVariable Long vpcId, @PathVariable String type) {
        return subnetGroupRepository.findByVpcIdAndType(vpcId, type);
    }

    @GetMapping("/subnetGroups")
    @Transactional
    Collection<SubnetGroup> subnetGroups() {
    	Collection<SubnetGroup> sgs = subnetGroupRepository.findAll();
    	/*Iterator<SubnetGroup> it = sgs.iterator();
    	while(it.hasNext()) {
    		SubnetGroup sg = (SubnetGroup)it.next();
    		System.out.println("subnet load sg:" + sg.getId() + "   taille=" + sg.getSubnets().size());
    		Iterator<Subnet> itt = sg.getSubnets().iterator();
        	while(itt.hasNext()) {
        		Subnet sbb = (Subnet)itt.next();
        		System.out.println("subnet load subnet:" + sbb.getId());
        	} 
    	}*/
    	return sgs;
    }
    
    @GetMapping("/subnetGroups/{id}")
    ResponseEntity<?> getSubnetGroup(@PathVariable Long id) {
        Optional<SubnetGroup> subnetGroup = subnetGroupRepository.findById(id);
        
        //System.out.println("subnetGroup:" +  subnetGroup.toString());
        
        return subnetGroup.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    
    @PutMapping("/vpcs/{vpcId}/subnetGroups/{subnetGroupId}")
    public SubnetGroup updateSubnetGroup(@PathVariable Long vpcId,
                               @PathVariable Long subnetGroupId,
                               @Valid @RequestBody SubnetGroup subnetGroupRequest) {
        
    	//System.out.println("update subnetgroup");
    	if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);

        List<Subnet> sg = subnetGroupRequest.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = sg.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getSubnetgroup().add(subnetGroupRequest);
    		subnets.add(subnet.get());
    	}
        
        
        return subnetGroupRepository.findById(subnetGroupId)
                .map(subnetGroup -> {
                     	
                	Iterator<Subnet> iti = subnetGroup.getSubnets().iterator();
                	while(iti.hasNext()) {
                		Subnet sbb = (Subnet)iti.next();
                		sbb.getSubnetgroup().remove(subnetGroup);
                		subnetRepository.save(sbb);
                	}
                	
                	subnetGroup.setText(subnetGroupRequest.getText());
                	subnetGroup.setName(subnetGroupRequest.getName());
                	subnetGroup.setType(subnetGroupRequest.getType());
                	subnetGroup.setSubnets(subnets);
                	subnetGroup.setVpc(vpc.get());
                	subnetGroup.setAccount(subnetGroupRequest.getAccount());
                	subnetGroup.setProduct(subnetGroupRequest.getProduct());
                	SubnetGroup sb = subnetGroupRepository.save(subnetGroup);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return sb;
              
                }).orElseThrow(() -> new ResourceNotFoundException("SubnetGroup not found with id " + subnetGroupId));
    }

    @DeleteMapping("/vpcs/{vpcId}/subnetGroups/{subnetGroupId}")
    public ResponseEntity<?> deleteSubnetGroup(@PathVariable Long vpcId,
                                          @PathVariable Long subnetGroupId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return subnetGroupRepository.findById(subnetGroupId)
                .map(subnetGroup -> {
                	Iterator<Subnet> itt = subnetGroup.getSubnets().iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		sbb.getSubnetgroup().remove(subnetGroup);
                		subnetRepository.save(sbb);
                	}
                	subnetGroupRepository.delete(subnetGroup);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("SubnetGroup not found with id " + subnetGroupId));

    }
    
    @PostMapping("/vpcs/{vpcId}/subnetGroups")
    public SubnetGroup addSubnetGroup(@PathVariable String vpcId,
                            @Valid @RequestBody SubnetGroup subnetGroup) {
    	long accId = Long.valueOf(vpcId);
    	
    	List<Subnet> sg = subnetGroup.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = sg.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getSubnetgroup().add(subnetGroup);
    		subnets.add(subnet.get());
    	}
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	subnetGroup.setSubnets(subnets);
                	subnetGroup.setVpc(vpc);
                	SubnetGroup sb = subnetGroupRepository.save(subnetGroup);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return sb;
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

   
}
