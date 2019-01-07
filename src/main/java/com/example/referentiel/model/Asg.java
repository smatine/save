package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "asgs")
public class Asg extends AuditModel {
    @Id
    @GeneratedValue(generator = "asg_generator")
    @SequenceGenerator(
            name = "asg_generator",
            sequenceName = "asg_sequence",
            initialValue = 1000
    )
    private Long id;

    @Column(columnDefinition = "text")
    private String text; 
    
    @NotBlank
    private String name;
   
	
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne (fetch = FetchType.EAGER, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
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

    
}
