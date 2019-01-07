package com.example.referentiel.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Entity
@Table(name = "elasticComputes")
@ApiModel(description="All details about the trigrammes. ")
public class ElasticCompute extends AuditModel {
    @Id
    @GeneratedValue(generator = "elasticCompute_generator")
    @SequenceGenerator(
            name = "elasticCompute_generator",
            sequenceName = "elasticCompute_sequence",
            initialValue = 1000
    )
    private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

    
}
