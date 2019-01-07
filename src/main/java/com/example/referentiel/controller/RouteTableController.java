package com.example.referentiel.controller;

import com.example.referentiel.exception.ResourceNotFoundException;
import com.example.referentiel.model.RouteTable;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.RouteTableRepository;
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
public class RouteTableController {

    @Autowired
    private RouteTableRepository routeTableRepository;

    @Autowired
    private VpcRepository vpcRepository;
    
    @Autowired
    private SubnetRepository subnetRepository;

    @GetMapping("/vpcs/{vpcId}/routeTables")
    public List<RouteTable> getRouteTablesByVpcId(@PathVariable Long vpcId) {
        return routeTableRepository.findByVpcId(vpcId);
    }

    @GetMapping("/routeTables")
    Collection<RouteTable> routeTables() {
    	Collection<RouteTable> routeTables = routeTableRepository.findAll();  	
        return routeTables;
    }
    
    @GetMapping("/routeTables/{id}")
    ResponseEntity<?> getRouteTable(@PathVariable Long id) {
        Optional<RouteTable> routeTable = routeTableRepository.findById(id);
        System.out.println("subnet load subnet!:" + routeTable.get().getSubnets().size());
        Iterator<Subnet> itt = routeTable.get().getSubnets().iterator();
    	while(itt.hasNext()) {
    		Subnet sbb = (Subnet)itt.next();
    		System.out.println("subnet load subnet:" + sbb.getId());
    	} 
    	
        return routeTable.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/vpcs/{vpcId}/routeTables")
    public RouteTable addRouteTable(@PathVariable String vpcId,
                            @Valid @RequestBody RouteTable routeTable) {
    	
    	long accId = Long.valueOf(vpcId);
    	
    	List<Subnet> subs = routeTable.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		System.out.println("subnet add subnet:");
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getRoutetables().add(routeTable);
    		subnets.add(subnet.get());
    		System.out.println("subnet add subnet:" + subnet.get().getId());
    	}
    	
        return vpcRepository.findById(accId)
                .map(vpc -> {
                	
                	routeTable.setSubnets(subnets);
                	routeTable.setVpc(vpc);
                	
                	RouteTable na = routeTableRepository.save(routeTable);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return na;
                	
                }).orElseThrow(() -> new ResourceNotFoundException("Vpc not found with id " + vpcId));
    }

    @PutMapping("/vpcs/{vpcId}/routeTables/{routeTableId}")
    public RouteTable updateRouteTable(@PathVariable Long vpcId,
                               @PathVariable Long routeTableId,
                               @Valid @RequestBody RouteTable routeTableRequest) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }
        Optional<Vpc> vpc = vpcRepository.findById(vpcId);

        List<Subnet> subs = routeTableRequest.getSubnets();
    	List<Subnet> subnets = new ArrayList<>();
    	Iterator<Subnet> it = subs.iterator();
    	while(it.hasNext()) {
    		Subnet sb = (Subnet)it.next();
    		Optional<Subnet> subnet = subnetRepository.findById(sb.getId());
    	    subnet.get().getRoutetables().add(routeTableRequest);
    		subnets.add(subnet.get());
    	}

    	
        return routeTableRepository.findById(routeTableId)
                .map(routeTable -> {
                	
                	Iterator<Subnet> iti = routeTable.getSubnets().iterator();
                	while(iti.hasNext()) {
                		Subnet sbb = (Subnet)iti.next();
                		sbb.getRoutetables().remove(routeTable);
                		subnetRepository.save(sbb);
                	}
                	
                	routeTable.setText(routeTableRequest.getText());
                	routeTable.setName(routeTableRequest.getName());
                	routeTable.setDef(routeTableRequest.isDef());
                	routeTable.setSubnets(subnets);
                	routeTable.setVpc(vpc.get());
                	routeTable.setAccount(routeTableRequest.getAccount());
                	
                	RouteTable na = routeTableRepository.save(routeTable);
                	Iterator<Subnet> itt = subnets.iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		subnetRepository.save(sbb);
                	}
                    return na;
                    
                }).orElseThrow(() -> new ResourceNotFoundException("RouteTable not found with id " + routeTableId));
    }

    @DeleteMapping("/vpcs/{vpcId}/routeTables/{routeTableId}")
    public ResponseEntity<?> deleteRouteTable(@PathVariable Long vpcId,
                                          @PathVariable Long routeTableId) {
        if(!vpcRepository.existsById(vpcId)) {
            throw new ResourceNotFoundException("Vpc not found with id " + vpcId);
        }

        return routeTableRepository.findById(routeTableId)
                .map(routeTable -> {
                	
                	Iterator<Subnet> itt = routeTable.getSubnets().iterator();
                	while(itt.hasNext()) {
                		Subnet sbb = (Subnet)itt.next();
                		sbb.getRoutetables().remove(routeTable);
                		subnetRepository.save(sbb);
                	}
                	
                	routeTableRepository.delete(routeTable);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("RouteTable not found with id " + routeTableId));

    }
}
