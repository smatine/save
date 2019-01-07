package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomAccountSerializer;
import com.example.referentiel.model.json.CustomVpcSerializer;
import com.example.referentiel.model.json.CustomSubnetSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "products")
public class Product extends AuditModel {
    @Id
    @GeneratedValue(generator = "product_generator")
    @SequenceGenerator(
            name = "product_generator",
            sequenceName = "product_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @Email
    @ApiModelProperty(notes="mailList alert should have mail format",dataType="String")
    private String mailListAlert;
    
    public String getMailListAlert() {
		return mailListAlert;
	}

	public void setMailListAlert(String mailListAlert) {
		this.mailListAlert = mailListAlert;
	}

	@NotBlank
    @Email
    @ApiModelProperty(notes="mailList should have mail format",dataType="String")
    private String mailList;
    
    public String getMailList() {
		return mailList;
	}

	public void setMailList(String mailList) {
		this.mailList = mailList;
	}
	
    @Column(columnDefinition = "text")
    private String text;

    private String appContext;
    
    public String getAppContext() {
		return appContext;
	}

	public void setAppContext(String appContext) {
		this.appContext = appContext;
	}

    
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@NotBlank
    private String type;
	
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@NotBlank
    private String bastion;
    
	public String getBastion() {
		return bastion;
	}

	public void setBastion(String bastion) {
		this.bastion = bastion;
	}

	@ManyToOne (fetch = FetchType.EAGER, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trigramme_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Trigramme trigramme;

    

	public Trigramme getTrigramme() {
		return trigramme;
	}

	public void setTrigramme(Trigramme trigramme) {
		this.trigramme = trigramme;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "product_account", 
    joinColumns = { @JoinColumn(name = "product_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "account_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomAccountSerializer.class)
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnore
    private List<Account> accounts = new ArrayList<>();

	public List<Account> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}
    
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "product_vpc", 
    joinColumns = { @JoinColumn(name = "product_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "vpc_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomVpcSerializer.class)
	@OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnore
    private List<Vpc> vpcs = new ArrayList<>();

	public List<Vpc> getVpcs() {
		return vpcs;
	}

	public void setVpcs(List<Vpc> vpcs) {
		this.vpcs = vpcs;
	}

	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "product_subnet", 
    joinColumns = { @JoinColumn(name = "product_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomSubnetSerializer.class)
	@OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnore
    private List<Subnet> subnets = new ArrayList<>();

	public List<Subnet> getSubnets() {
		return subnets;
	}

	public void setSubnets(List<Subnet> subnets) {
		this.subnets = subnets;
	}
	
	
	
}
