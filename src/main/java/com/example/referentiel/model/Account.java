package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "accounts")
public class Account extends AuditModel {
    @Id
    @GeneratedValue(generator = "account_generator")
    @SequenceGenerator(
            name = "account_generator",
            sequenceName = "account_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text;

    
    
    @NotBlank
    @Size(min = 12, max = 12)
    @Column(unique=true, nullable=false)
    private String numAccount;
    
    
    public String getNumAccount() {
		return numAccount;
	}

	public void setNumAccount(String numAccount) {
		this.numAccount = numAccount;
	}
	
	@NotBlank
	private String alias;
    
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}
    /*
	@NotBlank
	private String region;
    
    public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}
    */
	
	@NotBlank
    @Size(min = 3, max = 3, message="Env should have 3 characters")
	@ApiModelProperty(notes="Env should have 3 characters")
    private String env;
    
    public String getEnv() {
		return env;
	}

	public void setEnv(String env) {
		this.env = env;
	}

	@NotBlank
    private String mailList;
    
    public String getMailList() {
		return mailList;
	}

	public void setMailList(String mailList) {
		this.mailList = mailList;
	}
	/*
	@ManyToOne (fetch = FetchType.EAGER,  optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
 
    private Product product;

    public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
    */
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

    @ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trigramme_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Trigramme trigramme;


	public Trigramme getTrigramme() {
		return trigramme;
	}

	public void setTrigramme(Trigramme trigramme) {
		this.trigramme = trigramme;
	}
    
    
	@ManyToMany(fetch = FetchType.LAZY, 
            mappedBy = "accounts")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Product> products = new ArrayList<>();


	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}
	
	
	

}
