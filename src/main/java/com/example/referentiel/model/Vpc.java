package com.example.referentiel.model;

import com.example.referentiel.model.json.CustomRouteTableSerializer;
import com.example.referentiel.model.json.CustomDhcpSerializer;
import com.example.referentiel.model.json.CustomNaclSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "vpcs")
public class Vpc extends AuditModel {
    @Id
    @GeneratedValue(generator = "vpc_generator")
    @SequenceGenerator(
            name = "vpc_generator",
            sequenceName = "vpc_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text; 
    
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
	
	@OneToOne (fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "cidr_id", nullable = true)
	private Cidr cidr;
	

	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

    
    //ajout
    @OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "vpc")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "vpc", "subnets", "subnet"})
    @JsonSerialize(using = CustomNaclSerializer.class)
    private List<Nacl> nacls = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "vpc")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "vpc", "subnets", "subnet", "endPoints", "endPoint"})
    @JsonSerialize(using = CustomRouteTableSerializer.class)
    private List<RouteTable> routeTables = new ArrayList<>();
    
	@OneToMany(fetch = FetchType.LAZY, 
            mappedBy = "vpc")
    @OnDelete(action = OnDeleteAction.CASCADE)
	//@JsonIgnoreProperties({ "vpc"})
	@JsonSerialize(using = CustomDhcpSerializer.class)
    private List<Dhcp> dhcps = new ArrayList<>();

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Cidr getCidr() {
		return cidr;
	}

	public void setCidr(Cidr cidr) {
		this.cidr = cidr;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public List<Nacl> getNacls() {
		return nacls;
	}

	public void setNacls(List<Nacl> nacls) {
		this.nacls = nacls;
	}

	public List<RouteTable> getRouteTables() {
		return routeTables;
	}

	public void setRouteTables(List<RouteTable> routeTables) {
		this.routeTables = routeTables;
	}

	public List<Dhcp> getDhcps() {
		return dhcps;
	}

	public void setDhcps(List<Dhcp> dhcps) {
		this.dhcps = dhcps;
	}


	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "vpcs")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Product> products = new ArrayList<>();


	public List<Product> getProducts() {
		return products; 
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}
	
    
}
