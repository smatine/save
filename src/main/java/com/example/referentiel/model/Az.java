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
@Table(name = "azs")
public class Az extends AuditModel {
    @Id
    @GeneratedValue(generator = "az_generator")
    @SequenceGenerator(
            name = "az_generator",
            sequenceName = "az_sequence",
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
	
	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(columnDefinition = "text")
    private String description;


	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    
    @ManyToOne (fetch = FetchType.EAGER, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Region region;


	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}


	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            mappedBy = "az")
	@JsonIgnoreProperties({ "az", "sCidr"})
    private Set<Subnet> subnets = new HashSet<>();


	public Set<Subnet> getSubnets() {
		return subnets;
	}

	public void setSubnets(Set<Subnet> subnets) {
		this.subnets = subnets;
	}
	
	@OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "az")
	@JsonIgnoreProperties({ "rdss", "rds", "az", "vpc", "sgs", "sg", "instanceType", "subnetgroup"})
    private Set<Rds> rdss = new HashSet<>();


	public Set<Rds> getRdss() {
		return rdss;
	}

	public void setRdss(Set<Rds> rdss) {
		this.rdss = rdss;
	}
	
	
  
}
