package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "autoscalinggroups")

public class AutoScalingGroup extends AuditModel {
    @Id
    @GeneratedValue(generator = "autoscalinggroup_generator")
    @SequenceGenerator(
            name = "autoscalinggroup_generator",
            sequenceName = "autoscalinggroup_sequence",
            initialValue = 1000
    )
	private Long id;
    //name, vpc, launchConfiguration, subnets, groupSize, loadBalancing, targetGroup, healthCheckType, healthCheckGracePeriod, 
    //instanceProtection, 
    //serviceLinkedRole, createAutoScalingGroup
	@NotBlank
	@Column(unique=true, nullable=false) 
	private String name;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "vpc_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Vpc vpc;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "launchConfiguration_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private LaunchConfiguration launchConfiguration;

	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "autoScalingGroups")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Subnet> subnets = new ArrayList<>();

	private Long groupSize = 1l;
	   
	private boolean loadBalancing = false;
	   
	
	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "autoScalingGroups")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<TargetGroup> targetGroups = new ArrayList<>();
	   
	private String healthCheckType = "Ec2";
	   
	private Long healthCheckGracePeriod = 300l;
	   
	private String instanceProtection;
	
	@NotBlank
	private String serviceLinkedRole;
	   
	private boolean createAutoScalingGroup = true;

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

	public LaunchConfiguration getLaunchConfiguration() {
		return launchConfiguration;
	}

	public void setLaunchConfiguration(LaunchConfiguration launchConfiguration) {
		this.launchConfiguration = launchConfiguration;
	}

	public List<Subnet> getSubnets() {
		return subnets;
	}

	public void setSubnets(List<Subnet> subnets) {
		this.subnets = subnets;
	}

	public Long getGroupSize() {
		return groupSize;
	}

	public void setGroupSize(Long groupSize) {
		this.groupSize = groupSize;
	}

	public boolean isLoadBalancing() {
		return loadBalancing;
	}

	public void setLoadBalancing(boolean loadBalancing) {
		this.loadBalancing = loadBalancing;
	}

	

	public List<TargetGroup> getTargetGroups() {
		return targetGroups;
	}

	public void setTargetGroups(List<TargetGroup> targetGroups) {
		this.targetGroups = targetGroups;
	}

	

	public String getHealthCheckType() {
		return healthCheckType;
	}

	public void setHealthCheckType(String healthCheckType) {
		this.healthCheckType = healthCheckType;
	}

	public Long getHealthCheckGracePeriod() {
		return healthCheckGracePeriod;
	}

	public void setHealthCheckGracePeriod(Long healthCheckGracePeriod) {
		this.healthCheckGracePeriod = healthCheckGracePeriod;
	}

	public String getInstanceProtection() {
		return instanceProtection;
	}

	public void setInstanceProtection(String instanceProtection) {
		this.instanceProtection = instanceProtection;
	}

	public String getServiceLinkedRole() {
		return serviceLinkedRole;
	}

	public void setServiceLinkedRole(String serviceLinkedRole) {
		this.serviceLinkedRole = serviceLinkedRole;
	}

	public boolean isCreateAutoScalingGroup() {
		return createAutoScalingGroup;
	}

	public void setCreateAutoScalingGroup(boolean createAutoScalingGroup) {
		this.createAutoScalingGroup = createAutoScalingGroup;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
   
	
   
}
