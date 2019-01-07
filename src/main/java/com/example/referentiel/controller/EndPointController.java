package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.model.EndPoint;
import com.example.referentiel.repository.VpcRepository;
import com.example.referentiel.repository.EndPointRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@Transactional
public class EndPointController {

    @Autowired
    private EndPointRepository endPointRepository;

    @Autowired
    private VpcRepository vpcRepository;
    

    @GetMapping("/vpcs/{vpcId}/endPoints")
    public List<EndPoint> getEndPointsByProductId(@PathVariable Long vpcId) {
        return endPointRepository.findByVpcId(vpcId);
    }
    
    @GetMapping("/endPoints")
    Collection<EndPoint> endPoints() {
    	
        return endPointRepository.findAll();
    }
    
    @GetMapping("/endPoints/{id}")
    ResponseEntity<?> getEndPoint(@PathVariable Long id) {
        Optional<EndPoint> endPoint = endPointRepository.findById(id);
        
        return endPoint.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/endPoints")
    public EndPoint addEndPoint(@PathVariable String vpcId,
                            @Valid @RequestBody EndPoint endPoint) {
    	
    	long prdId = Long.valueOf(vpcId);
    	
        return vpcRepository.findById(prdId)
                .map(vpc -> {
                    endPoint.setVpc(vpc);
                    return endPointRepository.save(endPoint);
                    
                }).orElseThrow(() -> new ResourceNotFoundException("vpc not found with id " + vpcId));         
    }
    
    @PutMapping("/vpcs/{vpcId}/endPoints/{endPointId}")
    public EndPoint updateEndPoint(@PathVariable Long vpcId,
                               @PathVariable Long endPointId,
                               @Valid @RequestBody EndPoint endPointRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);
        return endPointRepository.findById(endPointId)
                .map(endPoint -> {
                    endPoint.setName(endPointRequest.getName());
                    endPoint.setServiceName(endPointRequest.getServiceName());
                    
                    endPoint.setFullAccess(endPointRequest.isFullAccess());
                    endPoint.setPolicy(endPointRequest.getPolicy());
                    endPoint.setRouteTable(endPointRequest.getRouteTable());
                    endPoint.setVpc(vpc.get());
                    endPoint.setAccount(endPointRequest.getAccount());
                    return endPointRepository.save(endPoint);
                }).orElseThrow(() -> new ResourceNotFoundException("EndPoint not found with id " + endPointId));
    }

    @DeleteMapping("/vpcs/{vpcId}/endPoints/{endPointId}")
    public ResponseEntity<?> deleteEndPoint(@PathVariable Long vpcId,
                                          @PathVariable Long endPointId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("vpc not found with id " + vpcId);
        }
        return endPointRepository.findById(endPointId)
                .map(endPoint -> {
                    endPointRepository.delete(endPoint);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("EndPoint not found with id " + endPointId));

    }
}
