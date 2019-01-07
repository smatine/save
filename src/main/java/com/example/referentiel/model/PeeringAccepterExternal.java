package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "peeringaccepterexternals")
public class PeeringAccepterExternal extends AuditModel {
    @Id
    @GeneratedValue(generator = "peeringaccepterexternal_generator")
    @SequenceGenerator(
            name = "peeringaccepterexternal_generator",
            sequenceName = "peeringaccepterexternal_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    private String Owner;
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOwner() {
		return Owner;
	}

	public void setOwner(String owner) {
		Owner = owner;
	}

	public String getVpcId() {
		return VpcId;
	}

	public void setVpcId(String vpcId) {
		VpcId = vpcId;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	@NotBlank
    private String VpcId;
    
    @ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "region_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Region region;
    
    
    @OneToOne(mappedBy = "peeringAccepterExternal", orphanRemoval = true)
    @JsonIgnoreProperties("peeringAccepterExternal")
    private Peering peering;

	public Peering getPeering() {
		return peering;
	}

	public void setPeering(Peering peering) {
		this.peering = peering;
	}
    
}
