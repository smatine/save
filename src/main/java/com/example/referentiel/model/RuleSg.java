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
@Table(name = "rulesgs")
public class RuleSg extends AuditModel {
    @Id
    @GeneratedValue(generator = "rulesg_generator")
    @SequenceGenerator(
            name = "rulesg_generator",
            sequenceName = "rulesg_sequence",
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
    @JoinColumn(name = "sg_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Sg sg;

	
	public Sg getSg() {
		return sg;
	}

	public void setSg(Sg sg) {
		this.sg = sg;
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
    
	
}
