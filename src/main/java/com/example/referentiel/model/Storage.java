package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
@Table(name = "storages")
//@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
public class Storage extends AuditModel {
    @Id
    @GeneratedValue(generator = "storage_generator")
    @SequenceGenerator(
            name = "storage_generator",
            sequenceName = "storage_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @NotBlank
    @Column(unique=true, nullable=false) 
    private String name;
    
    
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	@ManyToOne (fetch = FetchType.LAZY, /*cascade=CascadeType.ALL,*/ optional = false) //(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
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
    
    private boolean versionning = true; 
    
    private boolean cloudWatchMetrics = false;
    
    @ManyToOne (fetch = FetchType.LAZY, optional = false) 
    @JoinColumn(name = "region_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Region region;


	public boolean isVersionning() {
		return versionning;
	}

	public void setVersionning(boolean versionning) {
		this.versionning = versionning;
	}

	public boolean isCloudWatchMetrics() {
		return cloudWatchMetrics;
	}

	public void setCloudWatchMetrics(boolean cloudWatchMetrics) {
		this.cloudWatchMetrics = cloudWatchMetrics;
	}

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	} 
	
	
	private boolean encryption = false; 
	
	private String encryptionType = "AES-256";
	
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true) 
    @JoinColumn(name = "kms_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Kms kms;


	public boolean isEncryption() {
		return encryption;
	}

	public void setEncryption(boolean encryption) {
		this.encryption = encryption;
	}

	public String getEncryptionType() {
		return encryptionType;
	}

	public void setEncryptionType(String encryptionType) {
		this.encryptionType = encryptionType;
	}

	public Kms getKms() {
		return kms;
	}

	public void setKms(Kms kms) {
		this.kms = kms;
	}
    
	@ManyToOne (fetch = FetchType.LAZY, optional = true) 
    @JoinColumn(name = "storage_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnoreProperties({ "storage", "kms", "region", "account", "storageTarget"})
    private Storage storageTarget;


	
	
	public Storage getStorageTarget() {
		return storageTarget;
	}

	public void setStorageTarget(Storage storageTarget) {
		this.storageTarget = storageTarget;
	}


	private boolean serverAccessLoging = false;
	
	private String targetPrefix;


	public boolean isServerAccessLoging() {
		return serverAccessLoging;
	}

	public void setServerAccessLoging(boolean serverAccessLoging) {
		this.serverAccessLoging = serverAccessLoging;
	}

	public String getTargetPrefix() {
		return targetPrefix;
	}

	public void setTargetPrefix(String targetPrefix) {
		this.targetPrefix = targetPrefix;
	}
	
	// 
	//
	//private boolean grantPublicReadAccess=false;
	
	private boolean grantAmazonS3ReadAccess=false;

/*
	public boolean isGrantPublicReadAccess() {
		return grantPublicReadAccess;
	}

	public void setGrantPublicReadAccess(boolean grantPublicReadAccess) {
		this.grantPublicReadAccess = grantPublicReadAccess;
	}
*/
	public boolean isGrantAmazonS3ReadAccess() {
		return grantAmazonS3ReadAccess;
	}

	public void setGrantAmazonS3ReadAccess(boolean grantAmazonS3ReadAccess) {
		this.grantAmazonS3ReadAccess = grantAmazonS3ReadAccess;
	}
	
	
	private boolean blockNewPublicAclObject=false;
	private boolean removePublicAccessGranted=false; 
	private boolean blockNewPublicBucket=false;
	private boolean blockPublicCross=false;


	public boolean isBlockNewPublicAclObject() {
		return blockNewPublicAclObject;
	}

	public void setBlockNewPublicAclObject(boolean blockNewPublicAclObject) {
		this.blockNewPublicAclObject = blockNewPublicAclObject;
	}

	public boolean isRemovePublicAccessGranted() {
		return removePublicAccessGranted;
	}

	public void setRemovePublicAccessGranted(boolean removePublicAccessGranted) {
		this.removePublicAccessGranted = removePublicAccessGranted;
	}

	public boolean isBlockNewPublicBucket() {
		return blockNewPublicBucket;
	}

	public void setBlockNewPublicBucket(boolean blockNewPublicBucket) {
		this.blockNewPublicBucket = blockNewPublicBucket;
	}

	public boolean isBlockPublicCross() {
		return blockPublicCross;
	}

	public void setBlockPublicCross(boolean blockPublicCross) {
		this.blockPublicCross = blockPublicCross;
	}
	
	
    private String cors;


	public String getCors() {
		return cors;
	}

	public void setCors(String cors) {
		this.cors = cors;
	}
    
    
}
