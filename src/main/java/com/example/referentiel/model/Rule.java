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
@Table(name = "rules")
public class Rule extends AuditModel {
    @Id
    @GeneratedValue(generator = "rule_generator")
    @SequenceGenerator(
            name = "rule_generator",
            sequenceName = "rule_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
	@ApiModelProperty(notes="Env should be INBOUND|OUTBOUND")
    private String type;
    
    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "nacl_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Nacl nacl;

	public Nacl getNacl() {
		return nacl;
	}

	public void setNacl(Nacl nacl) {
		this.nacl = nacl;
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
    private String number;
    
    public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getRuleType() {
		return ruleType;
	}

	public void setRuleType(String ruleType) {
		this.ruleType = ruleType;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getPortRange() {
		return portRange;
	}

	public void setPortRange(String portRange) {
		this.portRange = portRange;
	}

	public String getCidr() {
		return cidr;
	}

	public void setCidr(String cidr) {
		this.cidr = cidr;
	}


	@NotBlank
    private String ruleType;
    
    @NotBlank
    private String protocol;
    
    @NotBlank
    private String portRange;
    
    @NotBlank
    private String cidr;
    
    @NotBlank
    private String allow;

	public String getAllow() {
		return allow;
	}

	public void setAllow(String allow) {
		this.allow = allow;
	}

	
}
