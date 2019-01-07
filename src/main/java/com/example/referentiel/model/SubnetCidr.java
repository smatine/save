package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "subnetscidr")
public class SubnetCidr extends AuditModel {
    @Id
    @GeneratedValue(generator = "subnetcidr_generator")
    @SequenceGenerator(
            name = "subnetcidr_generator",
            sequenceName = "subnetcidr_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text;

    /*
    @NotBlank
    @ApiModelProperty(notes="Type should be VM or ELB or ALB")
	private String type;
    
   
    
    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
    */
	@NotBlank
    @Size(min = 9, max = 18)
    private String subnetCidr;
    
	public String getSubnetCidr() {
		return subnetCidr;
	}

	public void setSubnetCidr(String subnetCidr) {
		this.subnetCidr = subnetCidr;
	}

	@ManyToOne (fetch = FetchType.EAGER, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cidr_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cidr cidr;

	public Cidr getCidr() {
		return cidr;
	}

	public void setCidr(Cidr cidr) {
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

    @OneToOne(mappedBy = "sCidr", orphanRemoval = true)
    //@JsonBackReference
    @JsonIgnoreProperties("sCidr")
	private Subnet subnet = null;

	public Subnet getSubnet() {
		return subnet;
	}

	public void setSubnet(Subnet subnet) {
		this.subnet = subnet;
	}
}
