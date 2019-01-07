package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Lb;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.LbRepository;
import com.example.referentiel.repository.SgRepository;
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
public class LbController {

    @Autowired
    private LbRepository lbRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;

    @Autowired
    private SgRepository sgRepository;

    @GetMapping("/vpcs/{vpcId}/lbs")
    public List<Lb> getLbsByVpcId(@PathVariable Long vpcId) {
        return lbRepository.findByVpcId(vpcId);
    }

    @GetMapping("/lbs")
    Collection<Lb> lbs() {
    	Collection<Lb> lbs = lbRepository.findAll();  	
        return lbs;
    }
    
    @GetMapping("/lbs/{id}")
    ResponseEntity<?> getLb(@PathVariable Long id) {
        Optional<Lb> lb = lbRepository.findById(id);
        /*
        System.out.println("subnet load subnet!:" + lb.get().getSubnets().size());
        Iterator<Subnet> itt = lb.get().getSubnets().iterator();
    	while(itt.hasNext()) {
    		Subnet sbb = (Subnet)itt.next();
    		System.out.println("subnet load subnet:" + sbb.getId());
    	} 
    	*/
        return lb.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/lbs")
    public Lb addLb(@PathVariable String vpcId,
                            @Valid @RequestBody Lb lb) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Subnet> subs = lb.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getLbs().add(lb);
    		subnets.add(subnet.get());
    	}
    	
    	List<Sg> sgss = lb.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    	    sg.get().getLbs().add(lb);
    		sgs.add(sg.get());
    	}
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	
                	lb.setSubnets(subnets);
                	lb.setSgs(sgs);
                	lb.setVpc(vpc);
                	Lb na = lbRepository.save(lb);
                	
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                	
                	Iterator<Sg> itgs = sgs.iterator();
                	while(itgs.hasNext()) {
                		Sg s = (Sg)itgs.next();
                		sgRepository.save(s);
                	}
                    return na;
                	
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/lbs/{lbId}")
    public Lb updateLb(@PathVariable Long vpcId,
                               @PathVariable Long lbId,
                               @Valid @RequestBody Lb lbRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);

        List<Subnet> subs = lbRequest.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getLbs().add(lbRequest);
    		subnets.add(subnet.get());
    	}
    	
    	List<Sg> sgss = lbRequest.getSgs();
    	List<Sg> sgs = new ArrayList<>();
    	Iterator<Sg> itg = sgss.iterator();
    	while(itg.hasNext()) {
    		Sg s = (Sg)itg.next();
    		Optional<Sg> sg = sgRepository.findById(s.getId());
    	    sg.get().getLbs().add(lbRequest);
    		sgs.add(sg.get());
    	}
    	
        return lbRepository.findById(lbId)
                .map(lb -> {
                	
                	Iterator<Subnet> iti = lb.getSubnets().iterator();
                	while(iti.hasNext()) {
                		Subnet sbb = (Subnet)iti.next();
                		sbb.getLbs().remove(lb);
                		subnetRepository.save(sbb);
                	}
                	
                	Iterator<Sg> itsg = lb.getSgs().iterator();
                	while(itsg.hasNext()) {
                		Sg s = (Sg)itsg.next();
                		s.getLbs().remove(lb);
                		sgRepository.save(s);
                	}
                	
                	lb.setText(lbRequest.getText());
                	lb.setName(lbRequest.getName());
                	lb.setScheme(lbRequest.isScheme());
                	lb.setType(lbRequest.getType());
                	lb.setIpType(lbRequest.getIpType());
                	
                	lb.setDeletionProtection(lbRequest.isDeletionProtection());
                	lb.setCrossZoneLoadBalancing(lbRequest.isCrossZoneLoadBalancing());
                	lb.setHttp2(lbRequest.isHttp2());
                	lb.setAccessLogs(lbRequest.isAccessLogs());
                	lb.setIdleTimeout(lbRequest.getIdleTimeout());
                	lb.setConnectionDraining(lbRequest.getConnectionDraining());    
                	
                	
                	lb.setSubnets(subnets);
                	lb.setSgs(sgs);
                	lb.setVpc(vpc.get());
                	lb.setAccount(lbRequest.getAccount());
                	
                	Lb na = lbRepository.save(lb);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("Lb not found with id " + lbId));
    }

    @DeleteMapping("/vpcs/{vpcId}/lbs/{lbId}")
    public ResponseEntity<?> deleteLb(@PathVariable Long vpcId,
                                          @PathVariable Long lbId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return lbRepository.findById(lbId)
                .map(lb -> {
                	
                	Iterator<Subnet> itt = lb.getSubnets().iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		sbb.getLbs().remove(lb);
                		subnetRepository.save(sbb);
                	}
                	
                	lbRepository.delete(lb);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Lb not found with id " + lbId));

    }
}
