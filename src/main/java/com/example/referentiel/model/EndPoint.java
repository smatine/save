package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "endpoints")
public class EndPoint extends AuditModel {
    @Id
    @GeneratedValue(generator = "endpoint_generator")
    @SequenceGenerator(
            name = "endpoint_generator",
            sequenceName = "endpoint_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	@NotBlank
    private String serviceName;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "routetable_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private RouteTable routeTable;

	private boolean fullAccess = true;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "policy_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Policy policy;
	
	
	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public RouteTable getRouteTable() {
		return routeTable;
	}

	public void setRouteTable(RouteTable routeTable) {
		this.routeTable = routeTable;
	}

	public boolean isFullAccess() {
		return fullAccess;
	}

	public void setFullAccess(boolean fullAccess) {
		this.fullAccess = fullAccess;
	}

	public Policy getPolicy() {
		return policy;
	}

	public void setPolicy(Policy policy) {
		this.policy = policy;
	}

	
}
