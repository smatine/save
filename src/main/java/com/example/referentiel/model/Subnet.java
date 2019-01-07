package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomAutoScalingGroupSerializer;
import com.example.referentiel.model.json.CustomEccSerializer;
import com.example.referentiel.model.json.CustomLbSerializer;
import com.example.referentiel.model.json.CustomNaclSerializer;

import com.example.referentiel.model.json.CustomRouteTableSerializer;
import com.example.referentiel.model.json.CustomSubnetGroupSerializer;
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
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "subnets")
public class Subnet extends AuditModel {
    @Id
    @GeneratedValue(generator = "subnet_generator")
    @SequenceGenerator(
            name = "subnet_generator",
            sequenceName = "subnet_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text;

    
    @NotBlank
    @ApiModelProperty(notes="Type should be VM or ELB or ALB")
	private String type;
   
	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

    @OneToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = true)
	@JoinColumn(name = "subnetcidr_id", nullable = true)
	//@JsonManagedReference
	private SubnetCidr sCidr;
	
	@NotBlank
    @Column(unique=true, nullable=false) 
    private String name;

	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "az_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Az az;

	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_subnetgroup",
    joinColumns = { @JoinColumn(name = "subnet_id") },
    inverseJoinColumns = { @JoinColumn(name = "subnetgroup_id") })
	//@JsonIgnoreProperties({ "subnets"})
	@JsonSerialize(using = CustomSubnetGroupSerializer.class)
	//@JsonIgnore
    private List<SubnetGroup> subnetgroup = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_nacl", 
    joinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "nacl_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "subnets", "vpc"})
	//@JsonIgnore
	@JsonSerialize(using = CustomNaclSerializer.class)
    private List<Nacl> nacls = new ArrayList<>();

	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_routetable", 
    joinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "routetable_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "subnets", "vpc"})
	@JsonSerialize(using = CustomRouteTableSerializer.class)
	//@JsonIgnore
    private List<RouteTable> routetables = new ArrayList<>();
	
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_lb", 
    joinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "lb_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "subnets", "vpc"})
	@JsonSerialize(using = CustomLbSerializer.class)
	//@JsonIgnore
    private List<Lb> lbs = new ArrayList<>();

	/*
	@OneToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_ecc", 
    joinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "ecc_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "subnets", "vpc"})
	@JsonSerialize(using = CustomEccSerializer.class)
	//@JsonIgnore
    private List<Ecc> eccs = new ArrayList<>();
	*/
	/*
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "subnet")
	@JsonSerialize(using = CustomEccSerializer.class)
	private List<Ecc> eccs = new ArrayList<>();
	*/
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "subnet_autoScalingGroup", 
    joinColumns = { @JoinColumn(name = "subnet_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "autoScalingGroup_id", nullable = false, updatable = false) })
	//@JsonIgnoreProperties({ "subnets"})
	//@JsonIgnore
	@JsonSerialize(using = CustomAutoScalingGroupSerializer.class)
    private List<AutoScalingGroup> autoScalingGroups = new ArrayList<>();

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public SubnetCidr getsCidr() {
		return sCidr;
	}

	public void setsCidr(SubnetCidr sCidr) {
		this.sCidr = sCidr;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Az getAz() {
		return az;
	}

	public void setAz(Az az) {
		this.az = az;
	}

	public List<SubnetGroup> getSubnetgroup() {
		return subnetgroup;
	}

	public void setSubnetgroup(List<SubnetGroup> subnetgroup) {
		this.subnetgroup = subnetgroup;
	}

	public List<Nacl> getNacls() {
		return nacls;
	}

	public void setNacls(List<Nacl> nacls) {
		this.nacls = nacls;
	}

	public List<RouteTable> getRoutetables() {
		return routetables;
	}

	public void setRoutetables(List<RouteTable> routetables) {
		this.routetables = routetables;
	}

	public List<Lb> getLbs() {
		return lbs;
	}

	public void setLbs(List<Lb> lbs) {
		this.lbs = lbs;
	}
/*
	public List<Ecc> getEccs() {
		return eccs;
	}

	public void setEccs(List<Ecc> eccs) {
		this.eccs = eccs;
	}
*/
	public List<AutoScalingGroup> getAutoScalingGroups() {
		return autoScalingGroups;
	}

	public void setAutoScalingGroups(List<AutoScalingGroup> autoScalingGroups) {
		this.autoScalingGroups = autoScalingGroups;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "subnets")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Product> products = new ArrayList<>();


	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	
}
