package com.example.referentiel.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Entity
@Table(name = "trigrammes")
@ApiModel(description="All details about the trigrammes. ")
public class Trigramme extends AuditModel {
    @Id
    @GeneratedValue(generator = "trigramme_generator")
    @SequenceGenerator(
            name = "trigramme_generator",
            sequenceName = "trigramme_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Size(min = 3, max = 3, message="Name should have 3 characters")
    @ApiModelProperty(notes="Name should have 3 characters",dataType="String")
    @Column(unique=true, nullable=false) 
    private String name;

    
    @NotBlank
    @Email
    @ApiModelProperty(notes="Owner mail should have mail format",dataType="String")
    private String owner;

    public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	@Column(columnDefinition = "text")
    @ApiModelProperty(dataType="String")
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    @ApiModelProperty(dataType="String")
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    @NotBlank
    @Email
    @ApiModelProperty(notes="mailList should have mail format",dataType="String")
    private String mailList;
    
    public String getMailList() {
		return mailList;
	}

	public void setMailList(String mailList) {
		this.mailList = mailList;
	}
    
	@NotBlank
    @Size(min = 5, max = 5, message="IRT Code should have 5 characters")
    @ApiModelProperty(notes="IRT Code should have 3 characters",dataType="String")
    private String irtCode;
    
    public String getIrtCode() {
		return irtCode;
	}

	public void setIrtCode(String irtCode) {
		this.irtCode = irtCode;
	}

	
	
    public Trigramme() {
		super();
	}

	public Trigramme(Long id, String name, String owner, String description) {
		super();
		this.id = id;
		this.name = name;
		this.owner = owner;
		this.description = description;
	}
}
