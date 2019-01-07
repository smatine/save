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
@Table(name = "groups")
public class Group extends AuditModel {
    @Id
    @GeneratedValue(generator = "group_generator")
    @SequenceGenerator(
            name = "group_generator",
            sequenceName = "group_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    
    @ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "groups")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "role", "roles", "account", "endPoints", "groups"})
    private List<Policy> policys = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "groups")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "group", "groups"})
    private List<User> users = new ArrayList<>();

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
    
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


	public List<Policy> getPolicys() {
		return policys;
	}


	public void setPolicys(List<Policy> policys) {
		this.policys = policys;
	}


	public List<User> getUsers() {
		return users;
	}


	public void setUsers(List<User> users) {
		this.users = users;
	}


	public Account getAccount() {
		return account;
	}


	public void setAccount(Account account) {
		this.account = account;
	}
	
	
}
