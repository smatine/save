package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomEccSerializer;
import com.example.referentiel.model.json.CustomLaunchConfigurationSerializer;
import com.example.referentiel.model.json.CustomLbSerializer;
import com.example.referentiel.model.json.CustomRdsSerializer;
import com.example.referentiel.model.json.CustomElasticCacheSerializer;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
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
@Table(name = "sgs")
/*@JsonIdentityInfo(
		  generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, 
		  property = "id")*/
public class Sg extends AuditModel {
    @Id
    @GeneratedValue(generator = "sg_generator")
    @SequenceGenerator(
            name = "sg_generator",
            sequenceName = "sg_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;
	 
	

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(columnDefinition = "text")
    private String text;
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
	
    private String nameTag;


	public String getNameTag() {
		return nameTag;
	}

	public void setNameTag(String nameTag) {
		this.nameTag = nameTag;
	}
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "sg_lb", 
    joinColumns = { @JoinColumn(name = "sg_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "lb_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "sgs"})
	//@JsonIgnore
	@JsonSerialize(using = CustomLbSerializer.class)
    private List<Lb> lbs = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "sg_ecc", 
    joinColumns = { @JoinColumn(name = "sg_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "ecc_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "sgs"})
	//@JsonIgnore
	@JsonSerialize(using = CustomEccSerializer.class)
    private List<Ecc> eccs = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "sg_launchConfiguration", 
    joinColumns = { @JoinColumn(name = "sg_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "launchConfiguration_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomLaunchConfigurationSerializer.class)
	//@JsonIgnoreProperties({ "launchConfigurations"})
	//@JsonIgnore
    private List<LaunchConfiguration> launchConfigurations = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "sg_rds", 
    joinColumns = { @JoinColumn(name = "sg_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "rds_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomRdsSerializer.class)
	//@JsonIgnore
    private List<Rds> rdss = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "sg_elasticache", 
    joinColumns = { @JoinColumn(name = "sg_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "elasticache_id", nullable = false, updatable = false) })
	@JsonSerialize(using = CustomElasticCacheSerializer.class)
	//@JsonIgnore
	private List<ElasticCache> elasticaches = new ArrayList<>();


	public List<Lb> getLbs() {
		return lbs;
	}

	public void setLbs(List<Lb> lbs) {
		this.lbs = lbs;
	}

	public List<Ecc> getEccs() {
		return eccs;
	}

	public void setEccs(List<Ecc> eccs) {
		this.eccs = eccs;
	}

	public List<LaunchConfiguration> getLaunchConfigurations() {
		return launchConfigurations;
	}

	public void setLaunchConfigurations(List<LaunchConfiguration> launchConfigurations) {
		this.launchConfigurations = launchConfigurations;
	}

	public List<Rds> getRdss() {
		return rdss;
	}

	public void setRdss(List<Rds> rdss) {
		this.rdss = rdss;
	}

	public List<ElasticCache> getElasticaches() {
		return elasticaches;
	}

	public void setElasticaches(List<ElasticCache> elasticaches) {
		this.elasticaches = elasticaches;
	}

	
	

}
