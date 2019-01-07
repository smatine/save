package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Entity
@Table(name = "cidrs")
public class Cidr extends AuditModel {
    @Id
    @GeneratedValue(generator = "cidr_generator")
    @SequenceGenerator(
            name = "cidr_generator",
            sequenceName = "cidr_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text;

    @NotBlank
    @Size(min = 3, max = 3)
    private String env;
    
   
	public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	/*
	@NotBlank
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")
	private String ip;
	
	
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	@NotBlank
    @Size(min = 1, max = 2)
	@Pattern(regexp = "^(([1-9]|1[1-9]{1})$")
    private String range;
	
	
	public String getRange() {
		return range;
	}

	public void setRange(String range) {
		this.range = range;
	}
    */

	@NotBlank
    @Size(min = 9, max = 18)
    private String cidr;
   
	public String getCidr() {
		return cidr;
	}

	public void setCidr(String cidr) {
		this.cidr = cidr;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @OneToOne(mappedBy = "cidr", orphanRemoval = true)
    @JsonIgnoreProperties({"cidr", "nacls", "routeTables", "dhcps"})
	private Vpc vpc = null;


	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cidr)) return false;
        Cidr cidr = (Cidr) o;
        if(cidr.getId().equals(this.getId())) return true;
        if(cidr.getCidr().equals(this.getCidr())  && cidr.getRegion().getName().equals(this.getRegion().getName())) return true;
        return false;
    }
	
    @ManyToOne (fetch = FetchType.LAZY,  optional = false)
    @JoinColumn(name = "region_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "cidrs"})
    private Region region;


	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

    
}
