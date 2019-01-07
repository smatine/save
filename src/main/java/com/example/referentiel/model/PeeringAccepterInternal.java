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
@Table(name = "peeringaccepterinternals")
public class PeeringAccepterInternal extends AuditModel {
    @Id
    @GeneratedValue(generator = "peeringaccepterinternal_generator")
    @SequenceGenerator(
            name = "peeringaccepterinternal_generator",
            sequenceName = "peeringaccepterinternal_sequence",
            initialValue = 1000
    )
    private Long id;

	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}
    
	@OneToOne(mappedBy = "peeringAccepterInternal", orphanRemoval = true)
    @JsonIgnoreProperties("peeringAccepterInternal")
    private Peering peering;

	public Peering getPeering() {
		return peering;
	}

	public void setPeering(Peering peering) {
		this.peering = peering;
	}

}
