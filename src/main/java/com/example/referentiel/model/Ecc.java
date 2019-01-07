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
@Table(name = "eccs")
/*@JsonIdentityInfo(
		  generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, 
		  property = "id")*/
public class Ecc extends AuditModel {
    @Id
    @GeneratedValue(generator = "ecc_generator")
    @SequenceGenerator(
            name = "ecc_generator",
            sequenceName = "ecc_sequence",
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

	@NotBlank
    private String autoAssignPublicIp;
	
	@NotBlank
    private String shutdownBehaviour;
	
    private boolean enableTerminationProtection = false;
	
    private boolean encoded64 = false;
	
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subnet_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Subnet subnet;

	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instancetype_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private InstanceType instanceType;
    
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ami_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ami ami;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "role_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Role role;
   
	
	//ajout
    @OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "ecc")
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "targetGroup", "ecc"})
    private List<Target> targets = new ArrayList<>();
    
    
    
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public List<Target> getTargets() {
		return targets;
	}

	public void setTargets(List<Target> targets) {
		this.targets = targets;
	}

	private boolean monitoring = false;
    
    private boolean userData = false;
    
    private String userDataText;

    
	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "eccs")
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "eccs"})
    private List<Sg> sgs = new ArrayList<>();



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

	public Subnet getSubnet() {
		return subnet;
	}

	public void setSubnet(Subnet subnet) {
		this.subnet = subnet;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAutoAssignPublicIp() {
		return autoAssignPublicIp;
	}

	public void setAutoAssignPublicIp(String autoAssignPublicIp) {
		this.autoAssignPublicIp = autoAssignPublicIp;
	}

	public String getShutdownBehaviour() {
		return shutdownBehaviour;
	}

	public void setShutdownBehaviour(String shutdownBehaviour) {
		this.shutdownBehaviour = shutdownBehaviour;
	}

	public boolean isEnableTerminationProtection() {
		return enableTerminationProtection;
	}

	public void setEnableTerminationProtection(boolean enableTerminationProtection) {
		this.enableTerminationProtection = enableTerminationProtection;
	}

	public boolean isEncoded64() {
		return encoded64;
	}

	public void setEncoded64(boolean encoded64) {
		this.encoded64 = encoded64;
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

	public String getUserDataText() {
		return userDataText;
	}

	public void setUserDataText(String userDataText) {
		this.userDataText = userDataText;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	
	    
}
