package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomEccSerializer;
import com.example.referentiel.model.json.CustomRoleSerializer;
import com.example.referentiel.model.json.CustomUserSerializer;
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
@Table(name = "kmss")
public class Kms extends AuditModel {
    @Id
    @GeneratedValue(generator = "kmss_generator")
    @SequenceGenerator(
            name = "kmss_generator",
            sequenceName = "kmss_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @NotBlank
    private String alias;
	
    @Column(columnDefinition = "text")
    private String text;
	
    @ManyToOne (fetch = FetchType.LAZY, optional = false) 
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;


    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "role", "roles", "account", "endPoints", "groups", "kms", "kmss"})
    private Policy policy;
    
    private String keyMaterialOrigin = "Kms";
    

    
    @ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "kms_role",
    joinColumns = { @JoinColumn(name = "kms_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "role_id", nullable = false, updatable = false) })
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "policy", "policys", "account", "kms"})
    
    //@JsonIgnore
    //@JsonSerialize(using = CustomRoleSerializer.class)
    private List<Role> roles = new ArrayList<>(); 
   
    
    @ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "kms_user", 
    joinColumns = { @JoinColumn(name = "kms_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "user_id", nullable = false, updatable = false) })
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "kmss","kms", "account", "groups"})
    
    //@JsonIgnore
    //@JsonSerialize(using = CustomUserSerializer.class)
    private List<User> users = new ArrayList<>();


    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            mappedBy = "kms")
	//@JsonIgnoreProperties({"kms", "account", "region"})
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Storage> storages = new HashSet<>();
    
    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            mappedBy = "kms")
	//@JsonIgnoreProperties({"kms", "subnetgroup", "vpc"})
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Efs> efss = new HashSet<>();
    
    
    
    
	public Set<Efs> getEfss() {
		return efss;
	}


	public void setEfss(Set<Efs> efss) {
		this.efss = efss;
	}


	public Set<Storage> getStorages() {
		return storages;
	}


	public void setStorages(Set<Storage> storages) {
		this.storages = storages;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getAlias() {
		return alias;
	}


	public void setAlias(String alias) {
		this.alias = alias;
	}


	public String getText() {
		return text;
	}


	public void setText(String text) {
		this.text = text;
	}


	public Account getAccount() {
		return account;
	}


	public void setAccount(Account account) {
		this.account = account;
	}


	public Policy getPolicy() {
		return policy;
	}


	public void setPolicy(Policy policy) {
		this.policy = policy;
	}


	public String getKeyMaterialOrigin() {
		return keyMaterialOrigin;
	}


	public void setKeyMaterialOrigin(String keyMaterialOrigin) {
		this.keyMaterialOrigin = keyMaterialOrigin;
	}


	public List<Role> getRoles() {
		return roles;
	}


	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}


	public List<User> getUsers() {
		return users;
	}


	public void setUsers(List<User> users) {
		this.users = users;
	}


    
}
