package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Dhcp;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.DhcpRepository;
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
public class DhcpController {

    @Autowired
    private DhcpRepository dhcpRepository;

    @Autowired
    private VpcRepository vpcRepository;

    
    @GetMapping("/vpcs/{vpcId}/dhcps")
    public List<Dhcp> getDhcpsByVpcId(@PathVariable Long vpcId) {
        return dhcpRepository.findByVpcId(vpcId);
    }

    @GetMapping("/dhcps")
    Collection<Dhcp> dhcps() {
    	
    	Collection<Dhcp> dhcps = dhcpRepository.findAll();
        return dhcps;
    }
    
    @GetMapping("/dhcps/{id}")
    ResponseEntity<?> getDhcp(@PathVariable Long id) {
        Optional<Dhcp> dhcp = dhcpRepository.findById(id);
        
        return dhcp.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/dhcps")
    public Dhcp addDhcp(@PathVariable String vpcId,
                            @Valid @RequestBody Dhcp dhcp) {
    	
    	long accId = Long.valueOf(vpcId);
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	dhcp.setVpc(vpc);
                    return dhcpRepository.save(dhcp);
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/dhcps/{dhcpId}")
    public Dhcp updateDhcp(@PathVariable Long vpcId,
                               @PathVariable Long dhcpId,
                               @Valid @RequestBody Dhcp dhcpRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        //Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        
        return dhcpRepository.findById(dhcpId)
                .map(dhcp -> {
                	
                	dhcp.setName(dhcpRequest.getName());
                	dhcp.setDomainName(dhcpRequest.getDomainName());
                	dhcp.setDomainNameServers(dhcpRequest.getDomainNameServers());
                	dhcp.setNtpServers(dhcpRequest.getNtpServers());
                	dhcp.setNetBiosNameServers(dhcpRequest.getNetBiosNameServers());
                	dhcp.setNetBiosNodeType(dhcpRequest.getNetBiosNodeType());
                	
                	dhcp.setVpc(dhcpRequest.getVpc()/*vpc.get()*/);
                	dhcp.setAccount(dhcpRequest.getAccount());
                	
                	
                    return dhcpRepository.save(dhcp);
                }).orElseThrow(() -> new ResourceNotFoundException("Dhcp not found with id " + dhcpId));
    }

    @DeleteMapping("/vpcs/{vpcId}/dhcps/{dhcpId}")
    public ResponseEntity<?> deleteDhcp(@PathVariable Long vpcId,
                                          @PathVariable Long dhcpId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return dhcpRepository.findById(dhcpId)
                .map(dhcp -> {
                	dhcpRepository.delete(dhcp);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Dhcp not found with id " + dhcpId));

    }
}
