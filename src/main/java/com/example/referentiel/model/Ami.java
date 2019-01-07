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
@Table(name = "amis")
public class Ami extends AuditModel {
    @Id
    @GeneratedValue(generator = "ami_generator")
    @SequenceGenerator(
            name = "ami_generator",
            sequenceName = "ami_sequence",
            initialValue = 1000
    )
    private Long id;

	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "region_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Region region;
	

	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "ami")
	//@JsonIgnoreProperties("ami")
	@JsonIgnore
    private Set<Ecc> eccs = new HashSet<>();
	
	public Set<Ecc> getEccs() {
		return eccs;
	}

	public void setEccs(Set<Ecc> eccs) {
		this.eccs = eccs;
	}

	//Root Ebs  
    @NotBlank
    private String name;
    
    @NotBlank
    private String amiId;
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAmiId() {
		return amiId;
	}

	public void setAmiId(String amiId) {
		this.amiId = amiId;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Column(columnDefinition = "text")
    private String text;
	
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "ami")
	@JsonIgnore
    private Set<LaunchConfiguration> launchConfigurations = new HashSet<>();

	public Set<LaunchConfiguration> getLaunchConfigurations() {
		return launchConfigurations;
	}

	public void setLaunchConfigurations(Set<LaunchConfiguration> launchConfigurations) {
		this.launchConfigurations = launchConfigurations;
	}
	
}
