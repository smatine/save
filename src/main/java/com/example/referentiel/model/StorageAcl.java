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
@Table(name = "storageacls")
//@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
public class StorageAcl extends AuditModel {
    @Id
    @GeneratedValue(generator = "storageacl_generator")
    @SequenceGenerator(
            name = "storageacl_generator",
            sequenceName = "storageacl_sequence",
            initialValue = 1000
    )
    private Long id;	
	
	@ManyToOne (fetch = FetchType.LAZY,  optional = true)
    @JoinColumn(name = "account_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;
	
	@ManyToOne (fetch = FetchType.LAZY,  optional = true)
    @JoinColumn(name = "storage_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Storage storage;
	
	private String externalAccount = null;
	
	String groupe = null;
	
	private String store = null;
	
	private boolean write = false;
	
	private boolean read = false;
	
	private boolean listObject = false;
	
	private boolean writeObject = false;

	@NotBlank
	@ApiModelProperty(notes="type=Internal, External, Group, S3")
	private String type = "Internal";
	

	public String getGroupe() {
		return groupe;
	}

	public void setGroupe(String groupe) {
		this.groupe = groupe;
	}

	public String getStore() {
		return store;
	}

	public void setStore(String store) {
		this.store = store;
	}

	public boolean isListObject() {
		return listObject;
	}

	public void setListObject(boolean listObject) {
		this.listObject = listObject;
	}

	public boolean isWriteObject() {
		return writeObject;
	}

	public void setWriteObject(boolean writeObject) {
		this.writeObject = writeObject;
	}

	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public Storage getStorage() {
		return storage;
	}

	public void setStorage(Storage storage) {
		this.storage = storage;
	}

	public String getExternalAccount() {
		return externalAccount;
	}

	public void setExternalAccount(String externalAccount) {
		this.externalAccount = externalAccount;
	}

	public boolean isWrite() {
		return write;
	}

	public void setWrite(boolean write) {
		this.write = write;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}

    
}
