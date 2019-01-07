package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomEndPointSerializer;
import com.example.referentiel.model.json.CustomGroupSerializer;
import com.example.referentiel.model.json.CustomRoleSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

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
@Table(name = "policys")
public class Policy extends AuditModel {
    @Id
    @GeneratedValue(generator = "policy_generator")
    @SequenceGenerator(
            name = "policy_generator",
            sequenceName = "policy_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
	
	@NotBlank
    private String policyJson;
	
	private String description;
	
	@OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "policy")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "policy", "policys", "routeTable", "vpc"})
	//@JsonIgnore
	@JsonSerialize(using = CustomEndPointSerializer.class)
    private List<EndPoint> endPoints = new ArrayList<>();

	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "policy_role", 
    joinColumns = { @JoinColumn(name = "policy_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "role_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "policy", "policys", "account"})
	//@JsonIgnore
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonSerialize(using = CustomRoleSerializer.class)
    private List<Role> roles = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "policy_group", 
    joinColumns = { @JoinColumn(name = "policy_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "group_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "policy", "policys", "account", "users", "user"})
	//@JsonIgnore
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonSerialize(using = CustomGroupSerializer.class)
    private List<Group> groups = new ArrayList<>();
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "policy"})
    private Account account;
	
	
	@OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "policy")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "policy", "account"})
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

	public String getPolicyJson() {
		return policyJson;
	}

	public void setPolicyJson(String policyJson) {
		this.policyJson = policyJson;
	}

	public List<EndPoint> getEndPoints() {
		return endPoints;
	}

	public void setEndPoints(List<EndPoint> endPoints) {
		this.endPoints = endPoints;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public List<Group> getGroups() {
		return groups;
	}

	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	
}
