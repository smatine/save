package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.NaclRepository;
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
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class NaclController {

    @Autowired
    private NaclRepository naclRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;

    @GetMapping("/vpcs/{vpcId}/nacls")
    public List<Nacl> getNaclsByVpcId(@PathVariable Long vpcId) {
        return naclRepository.findByVpcId(vpcId);
    }

    @GetMapping("/nacls")
    Collection<Nacl> nacls() {
    	Collection<Nacl> nacls = naclRepository.findAll();  	
        return nacls;
    }
    
    @GetMapping("/nacls/{id}")
    ResponseEntity<?> getNacl(@PathVariable Long id) {
        Optional<Nacl> nacl = naclRepository.findById(id);
        System.out.println("subnet load subnet!:" + nacl.get().getSubnets().size());
        Iterator<Subnet> itt = nacl.get().getSubnets().iterator();
    	while(itt.hasNext()) {
    		Subnet sbb = (Subnet)itt.next();
    		System.out.println("subnet load subnet:" + sbb.getId());
    	} 
    	
        return nacl.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/nacls")
    public Nacl addNacl(@PathVariable String vpcId,
                            @Valid @RequestBody Nacl nacl) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Subnet> subs = nacl.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getNacls().add(nacl);
    		subnets.add(subnet.get());
    	}
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	
                	nacl.setSubnets(subnets);
                	nacl.setVpc(vpc);
                	
                	
                	Nacl na = naclRepository.save(nacl);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return na;
                	
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/nacls/{naclId}")
    public Nacl updateNacl(@PathVariable Long vpcId,
                               @PathVariable Long naclId,
                               @Valid @RequestBody Nacl naclRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);

        List<Subnet> subs = naclRequest.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getNacls().add(naclRequest);
    		subnets.add(subnet.get());
    	}

    	
        return naclRepository.findById(naclId)
                .map(nacl -> {
                	
                	Iterator<Subnet> iti = nacl.getSubnets().iterator();
                	while(iti.hasNext()) {
                		Subnet sbb = (Subnet)iti.next();
                		sbb.getNacls().remove(nacl);
                		subnetRepository.save(sbb);
                	}
                	
                	nacl.setText(naclRequest.getText());
                	nacl.setName(naclRequest.getName());
                	nacl.setDef(naclRequest.isDef());
                	nacl.setSubnets(subnets);
                	nacl.setVpc(vpc.get());
                	nacl.setAccount(naclRequest.getAccount());
                	
                	Nacl na = naclRepository.save(nacl);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("Nacl not found with id " + naclId));
    }

    @DeleteMapping("/vpcs/{vpcId}/nacls/{naclId}")
    public ResponseEntity<?> deleteNacl(@PathVariable Long vpcId,
                                          @PathVariable Long naclId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return naclRepository.findById(naclId)
                .map(nacl -> {
                	
                	Iterator<Subnet> itt = nacl.getSubnets().iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		sbb.getNacls().remove(nacl);
                		subnetRepository.save(sbb);
                	}
                	
                	naclRepository.delete(nacl);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Nacl not found with id " + naclId));

    }
}
