package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
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
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "launchconfigurations")

public class LaunchConfiguration extends AuditModel {
    @Id
    @GeneratedValue(generator = "launchconfiguration_generator")
    @SequenceGenerator(
            name = "launchconfiguration_generator",
            sequenceName = "launchconfiguration_sequence",
            initialValue = 1000
    )
    private Long id;
    
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    @NotBlank
    private String kernalId;
    @NotBlank
    private String ramDiskId;
    
    private boolean purchasingOption = false;
    
    private String iamRole;
    
    @NotBlank
    private String ipAddressType;
    
    private boolean monitoring = false;
    
    private boolean userData = false;
    private boolean encoded64 = false;
    private String userDataText;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
    
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instancetype_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private InstanceType instanceType;
    
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ami_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ami ami;
    
	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "launchConfigurations")
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "launchConfigurations", "launchConfiguration"})
    private List<Sg> sgs = new ArrayList<>();

	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
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

	public String getKernalId() {
		return kernalId;
	}

	public void setKernalId(String kernalId) {
		this.kernalId = kernalId;
	}

	public String getRamDiskId() {
		return ramDiskId;
	}

	public void setRamDiskId(String ramDiskId) {
		this.ramDiskId = ramDiskId;
	}

	public boolean isPurchasingOption() {
		return purchasingOption;
	}

	public void setPurchasingOption(boolean purchasingOption) {
		this.purchasingOption = purchasingOption;
	}

	public String getIamRole() {
		return iamRole;
	}

	public void setIamRole(String iamRole) {
		this.iamRole = iamRole;
	}

	public String getIpAddressType() {
		return ipAddressType;
	}

	public void setIpAddressType(String ipAddressType) {
		this.ipAddressType = ipAddressType;
	}

	public boolean isMonitoring() {
		return monitoring;
	}

	public void setMonitoring(boolean monitoring) {
		this.monitoring = monitoring;
	}

	public boolean isUserData() {
		return userData;
	}

	public void setUserData(boolean userData) {
		this.userData = userData;
	}

	public boolean isEncoded64() {
		return encoded64;
	}

	public void setEncoded64(boolean encoded64) {
		this.encoded64 = encoded64;
	}

	public String getUserDataText() {
		return userDataText;
	}

	public void setUserDataText(String userDataText) {
		this.userDataText = userDataText;
	}

	public InstanceType getInstanceType() {
		return instanceType;
	}

	public void setInstanceType(InstanceType instanceType) {
		this.instanceType = instanceType;
	}

	public Ami getAmi() {
		return ami;
	}

	public void setAmi(Ami ami) {
		this.ami = ami;
	}

	public List<Sg> getSgs() {
		return sgs;
	}

	public void setSgs(List<Sg> sgs) {
		this.sgs = sgs;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}


	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "launchConfiguration")
    @JsonIgnore
    private Set<AutoScalingGroup> autoScalingGroups = new HashSet<>();

	public Set<AutoScalingGroup> getAutoScalingGroups() {
		return autoScalingGroups;
	}

	public void setAutoScalingGroups(Set<AutoScalingGroup> autoScalingGroups) {
		this.autoScalingGroups = autoScalingGroups;
	}
    	
	    
}
