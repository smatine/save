package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "elasticSearchs")
public class ElasticSearch extends AuditModel {
    @Id
    @GeneratedValue(generator = "elasticSearch_generator")
    @SequenceGenerator(
            name = "elasticSearch_generator",
            sequenceName = "elasticSearch_sequence",
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
	
    private boolean isPrive = true;
    
	public boolean isPrive() {
		return isPrive;
	}

	public void setPrive(boolean isPrive) {
		this.isPrive = isPrive;
	}

	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = true) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	

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

    @ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "subnetgroup_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "rdss", "vpc", "subnets", "rdss", "efss", "elasticaches", "elasticsearchs"})
    private SubnetGroup subnetgroup;


	public SubnetGroup getSubnetgroup() {
		return subnetgroup;
	}

	public void setSubnetgroup(SubnetGroup subnetgroup) {
		this.subnetgroup = subnetgroup;
	}
	
	@NotBlank
    @Column(unique=true, nullable=false) 
    private String domainName;
	
	@NotBlank 
    private String version;
	
    //private Long instanceCount = 0l;
    
    //@NotBlank 
    //private String instanceType;
    
    
    private boolean enableDedicatedMaster = false;
    
    //private String dedicatedMasterInstanceType;
    
    //private Long dedicatedMasterInstanceCount = 0l;
    
    private boolean enableZoneAwareness = false;
    
    @NotBlank 
    private String storageType;
	
    @NotBlank 
    private String volumeType; 
    
    
    private Long volumeSize = 10l;
    
    private boolean enableEncrypt = false;
    
    @NotBlank 
    private String snapshotConfiguration;
	
    private boolean nodeToNodeEncryption = false;

    private Long provisionedIops = 1000l;
    
    private boolean allowExplicitIndex = true;
    
    private Long cacheSize = 0l;
    
    private Long maxClauseCount = 1024l;

    @NotBlank 
    private String accessPolicy;
    
	public String getAccessPolicy() {
		return accessPolicy;
	}

	public void setAccessPolicy(String accessPolicy) {
		this.accessPolicy = accessPolicy;
	}

	public boolean isAllowExplicitIndex() {
		return allowExplicitIndex;
	}

	public void setAllowExplicitIndex(boolean allowExplicitIndex) {
		this.allowExplicitIndex = allowExplicitIndex;
	}

	public Long getCacheSize() {
		return cacheSize;
	}

	public void setCacheSize(Long cacheSize) {
		this.cacheSize = cacheSize;
	}

	public Long getMaxClauseCount() {
		return maxClauseCount;
	}

	public void setMaxClauseCount(Long maxClauseCount) {
		this.maxClauseCount = maxClauseCount;
	}

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
/*
	public Long getInstanceCount() {
		return instanceCount;
	}

	public void setInstanceCount(Long instanceCount) {
		this.instanceCount = instanceCount;
	}
	*/
/*
	public String getInstanceType() {
		return instanceType;
	}

	public void setInstanceType(String instanceType) {
		this.instanceType = instanceType;
	}
*/
	public boolean isEnableDedicatedMaster() {
		return enableDedicatedMaster;
	}

	public void setEnableDedicatedMaster(boolean enableDedicatedMaster) {
		this.enableDedicatedMaster = enableDedicatedMaster;
	}
/*
	public String getDedicatedMasterInstanceType() {
		return dedicatedMasterInstanceType;
	}

	public void setDedicatedMasterInstanceType(String dedicatedMasterInstanceType) {
		this.dedicatedMasterInstanceType = dedicatedMasterInstanceType;
	}
*/
	/*
	public Long getDedicatedMasterInstanceCount() {
		return dedicatedMasterInstanceCount;
	}

	public void setDedicatedMasterInstanceCount(Long dedicatedMasterInstanceCount) {
		this.dedicatedMasterInstanceCount = dedicatedMasterInstanceCount;
	}
*/
	public boolean isEnableZoneAwareness() {
		return enableZoneAwareness;
	}

	public void setEnableZoneAwareness(boolean enableZoneAwareness) {
		this.enableZoneAwareness = enableZoneAwareness;
	}

	public String getStorageType() {
		return storageType;
	}

	public void setStorageType(String storageType) {
		this.storageType = storageType;
	}

	public String getVolumeType() {
		return volumeType;
	}

	public void setVolumeType(String volumeType) {
		this.volumeType = volumeType;
	}

	public Long getVolumeSize() {
		return volumeSize;
	}

	public void setVolumeSize(Long volumeSize) {
		this.volumeSize = volumeSize;
	}

	public boolean isEnableEncrypt() {
		return enableEncrypt;
	}

	public void setEnableEncrypt(boolean enableEncrypt) {
		this.enableEncrypt = enableEncrypt;
	}

	public String getSnapshotConfiguration() {
		return snapshotConfiguration;
	}

	public void setSnapshotConfiguration(String snapshotConfiguration) {
		this.snapshotConfiguration = snapshotConfiguration;
	}

	public boolean isNodeToNodeEncryption() {
		return nodeToNodeEncryption;
	}

	public void setNodeToNodeEncryption(boolean nodeToNodeEncryption) {
		this.nodeToNodeEncryption = nodeToNodeEncryption;
	}
    
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "elasticSearch")
    //@JsonIgnore
	@OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "elasticSearch"}) 
    private Set<Node> nodes = new HashSet<>();


	public Set<Node> getNodes() {
		return nodes;
	}

	public void setNodes(Set<Node> nodes) {
		this.nodes = nodes;
	}

	public Long getProvisionedIops() {
		return provisionedIops;
	}

	public void setProvisionedIops(Long provisionedIops) {
		this.provisionedIops = provisionedIops;
	}
    
    
}
