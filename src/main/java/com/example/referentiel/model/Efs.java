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
@Table(name = "efss")
public class Efs extends AuditModel {
    @Id
    @GeneratedValue(generator = "efs_generator")
    @SequenceGenerator(
            name = "efs_generator",
            sequenceName = "efs_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;	
	
	@ManyToOne (fetch = FetchType.EAGER, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vpc_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	

    @Column(columnDefinition = "text")
    private String text;

    @ManyToOne (fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "subnetgroup_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({ "efss"})
    private SubnetGroup subnetgroup;

	@ManyToOne (fetch = FetchType.LAZY, optional = true) 
    @JoinColumn(name = "kms_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Kms kms;


	private String kmsExterne;
	
	private boolean encryption = false;
	
	@ApiModelProperty(notes="type=Kms, KmsExterne")
	private String encryptionType = "Kms";
	
	@ApiModelProperty(notes="type=Default, MaxIo")
	private String performanceMode = "Default";
    
	
	@ApiModelProperty(notes="type=Bursting, Provisioned")
	private String throughputMode = "Bursting";
	
	private Long provisionedIo = 0l;

	
	public String getEncryptionType() {
		return encryptionType;
	}

	public void setEncryptionType(String encryptionType) {
		this.encryptionType = encryptionType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public SubnetGroup getSubnetgroup() {
		return subnetgroup;
	}

	public void setSubnetgroup(SubnetGroup subnetgroup) {
		this.subnetgroup = subnetgroup;
	}

	public Kms getKms() {
		return kms;
	}

	public void setKms(Kms kms) {
		this.kms = kms;
	}

	public String getKmsExterne() {
		return kmsExterne;
	}

	public void setKmsExterne(String kmsExterne) {
		this.kmsExterne = kmsExterne;
	}

	public boolean isEncryption() {
		return encryption;
	}

	public void setEncryption(boolean encryption) {
		this.encryption = encryption;
	}

	public String getPerformanceMode() {
		return performanceMode;
	}

	public void setPerformanceMode(String performanceMode) {
		this.performanceMode = performanceMode;
	}

	
	public String getThroughputMode() {
		return throughputMode;
	}

	public void setThroughputMode(String throughputMode) {
		this.throughputMode = throughputMode;
	}

	public Long getProvisionedIo() {
		return provisionedIo;
	}

	public void setProvisionedIo(Long provisionedIo) {
		this.provisionedIo = provisionedIo;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	
	
}
