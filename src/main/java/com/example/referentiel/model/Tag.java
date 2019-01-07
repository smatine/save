package com.example.referentiel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModelProperty;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "tags")
public class Tag extends AuditModel {
    @Id
    @GeneratedValue(generator = "tag_generator")
    @SequenceGenerator(
            name = "tag_generator",
            sequenceName = "tag_sequence",
            initialValue = 1000
    )
    private Long id;

   
    @NotBlank
    private String key;
    
    public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@NotBlank
    private String value;
	
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
    
    @ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "nacl_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Nacl nacl;

	public Nacl getNacl() {
		return nacl;
	}

	public void setNacl(Nacl nacl) {
		this.nacl = nacl;
	}

	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "sg_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Sg sg;

	public Sg getSg() {
		return sg;
	}

	public void setSg(Sg sg) {
		this.sg = sg;
	}

	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "routetable_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private RouteTable routeTable;

	public RouteTable getRouteTable() {
		return routeTable;
	}

	public void setRouteTable(RouteTable routeTable) {
		this.routeTable = routeTable;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "peering_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Peering peering;

	public Peering getPeering() {
		return peering;
	}

	public void setPeering(Peering peering) {
		this.peering = peering;
	}

	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "targetgroup_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private TargetGroup targetGroup;

	public TargetGroup getTargetGroup() {
		return targetGroup;
	}

	public void setTargetGroup(TargetGroup targetGroup) {
		this.targetGroup = targetGroup;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "lb_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Lb lb;

	public Lb getLb() {
		return lb;
	}

	public void setLb(Lb lb) {
		this.lb = lb;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ecc_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ecc ecc;

	public Ecc getEcc() {
		return ecc;
	}

	public void setEcc(Ecc ecc) {
		this.ecc = ecc;
	}
	
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "autoscalinggroup_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AutoScalingGroup autoScalingGroup;

	public AutoScalingGroup getAutoScalingGroup() {
		return autoScalingGroup;
	}

	public void setAutoScalingGroup(AutoScalingGroup autoScalingGroup) {
		this.autoScalingGroup = autoScalingGroup;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "vpc_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Vpc vpc;

	public Vpc getVpc() {
		return vpc;
	}

	public void setVpc(Vpc vpc) {
		this.vpc = vpc;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "subnet_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Subnet subnet;

	public Subnet getSubnet() {
		return subnet;
	}

	public void setSubnet(Subnet subnet) {
		this.subnet = subnet;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "dhcp_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Dhcp dhcp;

	public Dhcp getDhcp() {
		return dhcp;
	}

	public void setDhcp(Dhcp dhcp) {
		this.dhcp = dhcp;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "storage_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Storage storage;

	public Storage getStorage() {
		return storage;
	}

	public void setStorage(Storage storage) {
		this.storage = storage;
	}
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "kms_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Kms kms;

	public Kms getKms() {
		return kms;
	}

	public void setKms(Kms kms) {
		this.kms = kms;
	}
	
	
	@ManyToOne (fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "efs_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Efs efs;

	public Efs getEfs() {
		return efs;
	}

	public void setEfs(Efs efs) {
		this.efs = efs;
	}
	
	
	
	
}
