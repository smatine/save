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
@Table(name = "instancetypes")
public class InstanceType extends AuditModel {
    @Id
    @GeneratedValue(generator = "instancetype_generator")
    @SequenceGenerator(
            name = "instancetype_generator",
            sequenceName = "instancetype_sequence",
            initialValue = 1000
    )
    private Long id;

    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "instanceType")
	//@JsonIgnoreProperties("instanceType")
    @JsonIgnore
    private Set<Ecc> eccs = new HashSet<>();
    
    public Set<Ecc> getEccs() {
		return eccs;
	}

	public void setEccs(Set<Ecc> eccs) {
		this.eccs = eccs;
	}
	
	@NotBlank
    private String family; 
    
    @NotBlank
    @Column(unique=true, nullable=false)
    private String type;
    
    private long vcpus = 0l;
    
    public long getVcpus() {
		return vcpus;
	}

	public void setVcpus(long vcpus) {
		this.vcpus = vcpus;
	}

	private long memory = 0l;
    
    @NotBlank
    private String instanceStorage;
    
    private boolean ebsOptimized = true;
    
    @NotBlank
    private String networkPerformance;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFamily() {
		return family;
	}

	public void setFamily(String family) {
		this.family = family;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public long getMemory() {
		return memory;
	}

	public void setMemory(long memory) {
		this.memory = memory;
	}

	public String getInstanceStorage() {
		return instanceStorage;
	}

	public void setInstanceStorage(String instanceStorage) {
		this.instanceStorage = instanceStorage;
	}

	

	public boolean isEbsOptimized() {
		return ebsOptimized;
	}

	public void setEbsOptimized(boolean ebsOptimized) {
		this.ebsOptimized = ebsOptimized;
	}

	public String getNetworkPerformance() {
		return networkPerformance;
	}

	public void setNetworkPerformance(String networkPerformance) {
		this.networkPerformance = networkPerformance;
	}
    
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "instanceType")
    @JsonIgnore
    private Set<Node> nodes = new HashSet<>();

	public Set<Node> getNodes() {
		return nodes;
	}

	public void setNodes(Set<Node> nodes) {
		this.nodes = nodes;
	}
	
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "instanceType")
    @JsonIgnore
    private Set<LaunchConfiguration> launchConfigurations = new HashSet<>();

	public Set<LaunchConfiguration> getLaunchConfigurations() {
		return launchConfigurations;
	}

	public void setLaunchConfigurations(Set<LaunchConfiguration> launchConfigurations) {
		this.launchConfigurations = launchConfigurations;
	}
	
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "instanceType")
    @JsonIgnore
    //@JsonIgnoreProperties({ "rdss", "vpc", "sgs", "subnetgroup", "instanceType"})
    private Set<Rds> rdss = new HashSet<>();

	public Set<Rds> getRdss() {
		return rdss;
	}

	public void setRdss(Set<Rds> rdss) {
		this.rdss = rdss;
	}
	
	
	
 }
