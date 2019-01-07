package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "ssms")
public class Ssm extends AuditModel {
    @Id
    @GeneratedValue(generator = "ssm_generator")
    @SequenceGenerator(
            name = "ssm_generator",
            sequenceName = "ssm_sequence",
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
	
	
	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
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

    @Column(columnDefinition = "text")
    private String text;
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @NotBlank
    private String value; 
    
    @NotBlank
    private String type = "String";
    
    
    private String keyKmsId;


	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKeyKmsId() {
		return keyKmsId;
	}

	public void setKeyKmsId(String keyKmsId) {
		this.keyKmsId = keyKmsId;
	}
    
    
    
    
    
    
}
