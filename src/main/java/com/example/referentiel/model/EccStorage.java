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
@Table(name = "eccstorages")
public class EccStorage extends AuditModel {
    @Id
    @GeneratedValue(generator = "eccstorage_generator")
    @SequenceGenerator(
            name = "eccstorage_generator",
            sequenceName = "eccstorage_sequence",
            initialValue = 1000
    )
    private Long id;

	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ecc_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ecc ecc;
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "launchConfiguration_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private LaunchConfiguration launchConfiguration;

	//Root Ebs  
    @NotBlank
    private String volumeType;
    
    @NotBlank
    private String device;
    
    private String snapshot;
    
    //Size (GiB)
    private Long size = 0l;
    
    @NotBlank
    private String volume;
    
    
    private String iops;
     
    @NotBlank
    private String throughput ;
    
   
    private boolean deleteOnTermination = true ;
    
    @NotBlank
    private String encrypted ;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Ecc getEcc() {
		return ecc;
	}

	public void setEcc(Ecc ecc) {
		this.ecc = ecc;
	}

	public String getVolumeType() {
		return volumeType;
	}

	public void setVolumeType(String volumeType) {
		this.volumeType = volumeType;
	}

	public String getDevice() {
		return device;
	}

	public void setDevice(String device) {
		this.device = device;
	}

	public String getSnapshot() {
		return snapshot;
	}

	public void setSnapshot(String snapshot) {
		this.snapshot = snapshot;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public String getVolume() {
		return volume;
	}

	public void setVolume(String volume) {
		this.volume = volume;
	}

	public String getThroughput() {
		return throughput;
	}

	public void setThroughput(String throughput) {
		this.throughput = throughput;
	}

	public boolean isDeleteOnTermination() {
		return deleteOnTermination;
	}

	public void setDeleteOnTermination(boolean deleteOnTermination) {
		this.deleteOnTermination = deleteOnTermination;
	}

	public String getEncrypted() {
		return encrypted;
	}

	public void setEncrypted(String encrypted) {
		this.encrypted = encrypted;
	}

	public String getIops() {
		return iops;
	}

	public void setIops(String iops) {
		this.iops = iops;
	}

	public LaunchConfiguration getLaunchConfiguration() {
		return launchConfiguration;
	}

	public void setLaunchConfiguration(LaunchConfiguration launchConfiguration) {
		this.launchConfiguration = launchConfiguration;
	}
    
	
}
