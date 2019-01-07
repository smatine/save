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
@Table(name = "listeners")
public class Listener extends AuditModel {
    @Id
    @GeneratedValue(generator = "listener_generator")
    @SequenceGenerator(
            name = "listener_generator",
            sequenceName = "listener_sequence",
            initialValue = 1000
    )
    private Long id;

    
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Lb getLb() {
		return lb;
	}

	public void setLb(Lb lb) {
		this.lb = lb;
	}

	public String getProtocole() {
		return protocole;
	}

	public void setProtocole(String protocole) {
		this.protocole = protocole;
	}

	public Long getPort() {
		return port;
	}

	public void setPort(Long port) {
		this.port = port;
	}

	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "lb_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Lb lb;
   
	@OneToOne (fetch = FetchType.EAGER, optional = true)
	@JoinColumn(name = "targetgroup_id", nullable = true)
	private TargetGroup targetGroup;
	
    public TargetGroup getTargetGroup() {
		return targetGroup;
	}

	public void setTargetGroup(TargetGroup targetGroup) {
		this.targetGroup = targetGroup;
	}

	@NotBlank
    private String protocole;
    
    
    private Long port;

	
}
