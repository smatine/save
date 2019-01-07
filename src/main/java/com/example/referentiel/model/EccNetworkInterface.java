package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "eccnetworkinterfaces")
public class EccNetworkInterface extends AuditModel {
    @Id
    @GeneratedValue(generator = "eccnetworkinterface_generator")
    @SequenceGenerator(
            name = "eccnetworkinterface_generator",
            sequenceName = "eccnetworkinterface_sequence",
            initialValue = 1000
    )
    private Long id;

	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ecc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ecc ecc;

	
    //eth0
    @NotBlank
    private String device;
    
    @NotBlank
    private String networkInterface;
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Ecc getEcc() {
		return ecc;
	}

	public void setEcc(Ecc ecc) {
		this.ecc = ecc;
	}

	public String getDevice() {
		return device;
	}

	public void setDevice(String device) {
		this.device = device;
	}

	public String getNetworkInterface() {
		return networkInterface;
	}

	public void setNetworkInterface(String networkInterface) {
		this.networkInterface = networkInterface;
	}
	
	 
	
    private String primaryIp;
	
	public String getPrimaryIp() {
		return primaryIp;
	}

	public void setPrimaryIp(String primaryIp) {
		this.primaryIp = primaryIp;
	}

	public String getSecondaryIp() {
		return secondaryIp;
	}

	public void setSecondaryIp(String secondaryIp) {
		this.secondaryIp = secondaryIp;
	}

	public String getIpv6Ips() {
		return ipv6Ips;
	}

	public void setIpv6Ips(String ipv6Ips) {
		this.ipv6Ips = ipv6Ips;
	}


	private String secondaryIp;
	
	private String ipv6Ips;

	
    
}
