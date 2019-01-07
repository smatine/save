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
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "targetgroups")
public class TargetGroup extends AuditModel {
    @Id
    @GeneratedValue(generator = "targetgroup_generator")
    @SequenceGenerator(
            name = "targetgroup_generator",
            sequenceName = "targetgroup_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    @Column(columnDefinition = "text")
    private String text;
    public String getText() {
        return text;
    }

    
    @NotBlank
    private String protocole; 
    
    @NotNull
    private Long port;
    
    @NotBlank
    private String type;
    
    @ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
    
    //Health check settings
    @NotBlank
    private String hcprotocole;
    
    @NotBlank
    private String hcpath;
    
    //Advanced helth check settings
    
    
    private boolean ahportoverride = false;
    
    
    private Long ahport; 
    
    private Long ahhealthythreshold;

    
    private Long ahuhealthythreshold;
	
    
    private Long ahtimeout;
    
    @NotBlank
    private String ahsucesscode;
    
    
    private Long ahtinterval;
    
    @OneToOne(mappedBy = "targetGroup", orphanRemoval = true)
    @JsonIgnoreProperties("targetGroup")
	private Listener listener = null;
    
    
    private Long deregistrationDelay = 300l;
    
    private Long shortStartDuration = 0l;
    
    private boolean stickySession = false;
    
    
    
    
	public Long getDeregistrationDelay() {
		return deregistrationDelay;
	}

	public void setDeregistrationDelay(Long deregistrationDelay) {
		this.deregistrationDelay = deregistrationDelay;
	}

	public Long getShortStartDuration() {
		return shortStartDuration;
	}

	public void setShortStartDuration(Long shortStartDuration) {
		this.shortStartDuration = shortStartDuration;
	}

	public boolean isStickySession() {
		return stickySession;
	}

	public void setStickySession(boolean stickySession) {
		this.stickySession = stickySession;
	}

	public Listener getListener() {
		return listener;
	}

	public void setListener(Listener listener) {
		this.listener = listener;
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

	
	public Long getAhtinterval() {
		return ahtinterval;
	}

	public void setAhtinterval(Long ahtinterval) {
		this.ahtinterval = ahtinterval;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProtocole() {
		return protocole;
	}

	public void setProtocole(String protocole) {
		this.protocole = protocole;
	}

	public Long getPort() {
		return port;
	}

	public void setPort(Long port) {
		this.port = port;
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

	public String getHcprotocole() {
		return hcprotocole;
	}

	public void setHcprotocole(String hcprotocole) {
		this.hcprotocole = hcprotocole;
	}

	public String getHcpath() {
		return hcpath;
	}

	public void setHcpath(String hcpath) {
		this.hcpath = hcpath;
	}

	public boolean isAhportoverride() {
		return ahportoverride;
	}

	public void setAhportoverride(boolean ahportoverride) {
		this.ahportoverride = ahportoverride;
	}

	public Long getAhport() {
		return ahport;
	}

	public void setAhport(Long ahport) {
		this.ahport = ahport;
	}

	public Long getAhhealthythreshold() {
		return ahhealthythreshold;
	}

	public void setAhhealthythreshold(Long ahhealthythreshold) {
		this.ahhealthythreshold = ahhealthythreshold;
	}

	public Long getAhuhealthythreshold() {
		return ahuhealthythreshold;
	}

	public void setAhuhealthythreshold(Long ahuhealthythreshold) {
		this.ahuhealthythreshold = ahuhealthythreshold;
	}

	public Long getAhtimeout() {
		return ahtimeout;
	}

	public void setAhtimeout(Long ahtimeout) {
		this.ahtimeout = ahtimeout;
	}

	

	public String getAhsucesscode() {
		return ahsucesscode;
	}

	public void setAhsucesscode(String ahsucesscode) {
		this.ahsucesscode = ahsucesscode;
	}

	public void setText(String text) {
		this.text = text;
	}
    
	@ManyToMany (fetch = FetchType.LAZY)
	@JoinTable(name = "targetgroup_autoscalinggroup", 
    joinColumns = { @JoinColumn(name = "targetgroup_id", nullable = false, updatable = false) },
    inverseJoinColumns = { @JoinColumn(name = "autoscalinggroup_id", nullable = false, updatable = false) })
	@JsonIgnore
    private List<AutoScalingGroup> autoScalingGroups = new ArrayList<>();
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
	
    
}
