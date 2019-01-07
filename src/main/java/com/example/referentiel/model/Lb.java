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
@Table(name = "lbs")
public class Lb extends AuditModel {
    @Id
    @GeneratedValue(generator = "lb_generator")
    @SequenceGenerator(
            name = "lb_generator",
            sequenceName = "lb_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    @Column(columnDefinition = "text")
    private String text;

    @NotBlank
    private String type;
    
    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
    
	@NotBlank
    private String ipType = "ipv4";
	
    public String getIpType() {
		return ipType;
	}

	public void setIpType(String ipType) {
		this.ipType = ipType;
	}

	private boolean scheme = true;
    
	public boolean isDeletionProtection() {
		return deletionProtection;
	}

	public void setDeletionProtection(boolean deletionProtection) {
		this.deletionProtection = deletionProtection;
	}

	public boolean isCrossZoneLoadBalancing() {
		return crossZoneLoadBalancing;
	}

	public void setCrossZoneLoadBalancing(boolean crossZoneLoadBalancing) {
		this.crossZoneLoadBalancing = crossZoneLoadBalancing;
	}

	public long getIdleTimeout() {
		return idleTimeout;
	}

	public void setIdleTimeout(long idleTimeout) {
		this.idleTimeout = idleTimeout;
	}


	public boolean isAccessLogs() {
		return accessLogs;
	}

	public void setAccessLogs(boolean accessLogs) {
		this.accessLogs = accessLogs;
	}

	//Deletion Protection
	private boolean deletionProtection = false;

	
	//Cross-Zone Load Balancing
	private boolean crossZoneLoadBalancing  = false;
    
	
	private long connectionDraining=300;
	public long getConnectionDraining() {
		return connectionDraining;
	}

	public void setConnectionDraining(long connectionDraining) {
		this.connectionDraining = connectionDraining;
	}

	
	//Idle timeout 60s
	private long idleTimeout = 60; 
	//HTTP/2 Enabled 
	private boolean http2 = true;
	public boolean isHttp2() {
		return http2;
	}

	public void setHttp2(boolean http2) {
		this.http2 = http2;
	}

	//Access logs Disabled
	private boolean accessLogs = false;
	
    //liste listeners
    
    @ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
    
    @ManyToMany(fetch = FetchType.EAGER, 
            mappedBy = "lbs")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Subnet> subnets = new ArrayList<>();

    
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

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isScheme() {
		return scheme;
	}

	public void setScheme(boolean scheme) {
		this.scheme = scheme;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public List<Subnet> getSubnets() {
		return subnets;
	}

	public void setSubnets(List<Subnet> subnets) {
		this.subnets = subnets;
	}

	public List<Sg> getSgs() {
		return sgs;
	}

	public void setSgs(List<Sg> sgs) {
		this.sgs = sgs;
	}

	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "lbs")
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "lbs"})
    private List<Sg> sgs = new ArrayList<>();
   	
    
}
