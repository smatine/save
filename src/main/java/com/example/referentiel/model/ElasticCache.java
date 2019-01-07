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
@Table(name = "elasticaches")
public class ElasticCache extends AuditModel {
    @Id
    @GeneratedValue(generator = "elasticache_generator")
    @SequenceGenerator(
            name = "elasticache_generator",
            sequenceName = "elasticache_sequence",
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
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "policy"})
    private Account account;
	
	
	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	

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


    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subnetgroup_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    //@JsonIgnoreProperties({ "rdss", "vpc", "subnets", "rdss", "efss", "elasticaches", "elasticsearchs"})
    private SubnetGroup subnetgroup;


	public SubnetGroup getSubnetgroup() {
		return subnetgroup;
	}

	public void setSubnetgroup(SubnetGroup subnetgroup) {
		this.subnetgroup = subnetgroup;
	}

	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "elasticaches")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "rdss", "vpc", "lbs", "eccs", "launchConfigurations", "elasticaches"})
    private List<Sg> sgs = new ArrayList<>();


	public List<Sg> getSgs() {
		return sgs;
	}

	public void setSgs(List<Sg> sgs) {
		this.sgs = sgs;
	}
	
	private String EngineVersion;
	private Long port;
	private String parameterGroup;
	//private nodeType ;!!!!
	private Long numberOfReplica = 0l;
	//Redis or Memchached
	private String type = "Redis";
	
	
	
	
}
