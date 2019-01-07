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
@Table(name = "nodes")
public class Node extends AuditModel {
    @Id
    @GeneratedValue(generator = "node_generator")
    @SequenceGenerator(
            name = "node_generator",
            sequenceName = "node_sequence",
            initialValue = 1000
    )
    private Long id;

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private Long instanceCount = 0l;
    
    @NotBlank
    private String type;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "instanceType_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "nodes"})
    private InstanceType instanceType;

	public Long getInstanceCount() {
		return instanceCount;
	}

	public void setInstanceCount(Long instanceCount) {
		this.instanceCount = instanceCount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public InstanceType getInstanceType() {
		return instanceType;
	}

	public void setInstanceType(InstanceType instanceType) {
		this.instanceType = instanceType;
	}
  
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "elasticSearch_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "nodes"})
	private ElasticSearch elasticSearch;

	public ElasticSearch getElasticSearch() {
		return elasticSearch;
	}

	public void setElasticSearch(ElasticSearch elasticSearch) {
		this.elasticSearch = elasticSearch;
	}
}
