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
@Table(name = "roles")
public class Role extends AuditModel {
    @Id
    @GeneratedValue(generator = "role_generator")
    @SequenceGenerator(
            name = "role_generator",
            sequenceName = "role_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    private String description;
    
    @NotBlank
    private String serviceName;
    
    @ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "roles")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "role", "roles", "account", "endPoints", "groups"})
    //@JsonIgnore
    private List<Policy> policys = new ArrayList<>();

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
    
    
    @OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "role")
    @OnDelete(action = OnDeleteAction.CASCADE)
    //@JsonIgnoreProperties({ "vpc", "subnet", "instanceType", "ami", "role"})
    @JsonIgnore
    private List<Ecc> eccs = new ArrayList<>();
    
    
    @ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "roles")
    @OnDelete(action = OnDeleteAction.CASCADE)
    //@JsonIgnoreProperties({ "role", "roles", "account", "policy", "users", "storages"}) 
    @JsonIgnore
    private List<Kms> kmss = new ArrayList<>();

    
    
	public List<Kms> getKmss() {
		return kmss;
	}

	public void setKmss(List<Kms> kmss) {
		this.kmss = kmss;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public List<Policy> getPolicys() {
		return policys;
	}

	public void setPolicys(List<Policy> policys) {
		this.policys = policys;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public List<Ecc> getEccs() {
		return eccs;
	}

	public void setEccs(List<Ecc> eccs) {
		this.eccs = eccs;
	}
    
    
	
	
}
