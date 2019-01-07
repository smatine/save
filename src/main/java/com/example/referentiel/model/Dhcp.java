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
@Table(name = "dhcps")
public class Dhcp extends AuditModel {
    @Id
    @GeneratedValue(generator = "dhcp_generator")
    @SequenceGenerator(
            name = "dhcp_generator",
            sequenceName = "dhcp_sequence",
            initialValue = 1000
    )
    private Long id;
    //name, domainName, domainNameservers, NtpServers, NetBiosNameServers, NetBiosNodeType, vpc
   
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
	
    @NotBlank 
    @Column(unique=true, nullable=false)
    private String domainName;
    
    @NotBlank 
    private String domainNameServers;
    
    private String NtpServers;
    
    private String NetBiosNameServers;
    
    private String NetBiosNodeType;
	
	@ManyToOne (fetch = FetchType.LAZY,  optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	
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

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	
	public String getDomainNameServers() {
		return domainNameServers;
	}

	public void setDomainNameServers(String domainNameServers) {
		this.domainNameServers = domainNameServers;
	}

	public String getNtpServers() {
		return NtpServers;
	}

	public void setNtpServers(String ntpServers) {
		NtpServers = ntpServers;
	}

	public String getNetBiosNameServers() {
		return NetBiosNameServers;
	}

	public void setNetBiosNameServers(String netBiosNameServers) {
		NetBiosNameServers = netBiosNameServers;
	}

	public String getNetBiosNodeType() {
		return NetBiosNodeType;
	}

	public void setNetBiosNodeType(String netBiosNodeType) {
		NetBiosNodeType = netBiosNodeType;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	
	
    
}
