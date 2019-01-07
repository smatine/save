package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "routes")
public class Route extends AuditModel {
    @Id
    @GeneratedValue(generator = "route_generator")
    @SequenceGenerator(
            name = "route_generator",
            sequenceName = "route_sequence",
            initialValue = 1000
    )
    private Long id;

    
	
	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "routetable_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private RouteTable routeTable;

	
    @Column(columnDefinition = "text")
    private String text;
    
    @NotBlank
    private String destination;
    
    
    private String target = "Local";
    
    public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	private boolean propagation = false;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RouteTable getRouteTable() {
		return routeTable;
	}

	public void setRouteTable(RouteTable routeTable) {
		this.routeTable = routeTable;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public boolean isPropagation() {
		return propagation;
	}

	public void setPropagation(boolean propagation) {
		this.propagation = propagation;
	}
    
	@ManyToOne (fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "peering_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "vpc", "route", "peeringAccepterExternal", "peeringAccepterInternal"})
    private Peering peering;
	
	@ManyToOne (fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "endpoint_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "vpc", "route", "routeTable", "policy"})
    private EndPoint endPoint;
	
	@NotBlank
	private String targetType = "L";

	public Peering getPeering() {
		return peering;
	}

	public void setPeering(Peering peering) {
		this.peering = peering;
	}

	public EndPoint getEndPoint() {
		return endPoint;
	}

	public void setEndPoint(EndPoint endPoint) {
		this.endPoint = endPoint;
	}

	public String getTargetType() {
		return targetType;
	}

	public void setTargetType(String targetType) {
		this.targetType = targetType;
	}
	
	
	
	
	
	
	
    
}
