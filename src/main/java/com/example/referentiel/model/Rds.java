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
@Table(name = "rdss")
public class Rds extends AuditModel {
    @Id
    @GeneratedValue(generator = "rds_generator")
    @SequenceGenerator(
            name = "rds_generator",
            sequenceName = "rds_sequence",
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

    @Column(columnDefinition = "text")
    private String text;

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "policy"})
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
	
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subnetgroup_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    //@JsonIgnoreProperties({ "rdss", "vpc", /*"subnets",*/ "rdss", "efss", "elasticaches", "elasticsearchs"})
    private SubnetGroup subnetgroup;
    
    @ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "rdss")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "rdss", "vpc", "lbs", "eccs", "launchConfigurations", "elasticaches"})
    private List<Sg> sgs = new ArrayList<>();

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instancetype_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "rdss","eccs", "nodes", "launchConfigurations"})
    private InstanceType instanceType;
    
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false) 
    @JoinColumn(name = "az_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "subnets", "rdss", "region"})
    private Az az;
    
    
    //production ou Dev/Test
    private String env = "Production";
    
    private String type = "PostgreSQL";
    
    private String dbEngineVesion;
    
    private boolean multiAz = true;
    
    private String storageType = "General";
    
    private Long alocatedStorage = 0l;
    
    private Long provisionedIops = 0l;
    
    private String dbInstanceIdentifier;
    
    private String masterUserName;
    
    private String masterPassword;
    
    private String masterConfirmPassword;
    
    
    
	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDbEngineVesion() {
		return dbEngineVesion;
	}

	public void setDbEngineVesion(String dbEngineVesion) {
		this.dbEngineVesion = dbEngineVesion;
	}

	public boolean isMultiAz() {
		return multiAz;
	}

	public void setMultiAz(boolean multiAz) {
		this.multiAz = multiAz;
	}

	public String getStorageType() {
		return storageType;
	}

	public void setStorageType(String storageType) {
		this.storageType = storageType;
	}

	public Long getAlocatedStorage() {
		return alocatedStorage;
	}

	public void setAlocatedStorage(Long alocatedStorage) {
		this.alocatedStorage = alocatedStorage;
	}

	public Long getProvisionedIops() {
		return provisionedIops;
	}

	public void setProvisionedIops(Long provisionedIops) {
		this.provisionedIops = provisionedIops;
	}

	public String getDbInstanceIdentifier() {
		return dbInstanceIdentifier;
	}

	public void setDbInstanceIdentifier(String dbInstanceIdentifier) {
		this.dbInstanceIdentifier = dbInstanceIdentifier;
	}

	public String getMasterUserName() {
		return masterUserName;
	}

	public void setMasterUserName(String masterUserName) {
		this.masterUserName = masterUserName;
	}

	public String getMasterPassword() {
		return masterPassword;
	}

	public void setMasterPassword(String masterPassword) {
		this.masterPassword = masterPassword;
	}

	public String getMasterConfirmPassword() {
		return masterConfirmPassword;
	}

	public void setMasterConfirmPassword(String masterConfirmPassword) {
		this.masterConfirmPassword = masterConfirmPassword;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Az getAz() {
		return az;
	}

	public void setAz(Az az) {
		this.az = az;
	}

	public InstanceType getInstanceType() {
		return instanceType;
	}

	public void setInstanceType(InstanceType instanceType) {
		this.instanceType = instanceType;
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

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public SubnetGroup getSubnetgroup() {
		return subnetgroup;
	}

	public void setSubnetgroup(SubnetGroup subnetgroup) {
		this.subnetgroup = subnetgroup;
	}

	public List<Sg> getSgs() {
		return sgs;
	}

	public void setSgs(List<Sg> sgs) {
		this.sgs = sgs;
	}

    
    


	
}
