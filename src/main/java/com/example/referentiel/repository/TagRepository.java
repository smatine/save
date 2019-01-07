package com.example.referentiel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.referentiel.model.Rule;
import com.example.referentiel.model.Tag;


@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
	List<Tag> findByNaclId(Long naclId);
	List<Tag> findBySgId(Long sgId);
	List<Tag> findByRouteTableId(Long routeTableId);
	List<Tag> findByPeeringId(Long peeringId);
	List<Tag> findByTargetGroupId(Long targetGroupId);
	List<Tag> findByLbId(Long lbId);
	List<Tag> findByEccId(Long eccId);
	List<Tag> findByAutoScalingGroupId(Long autoScalingGroupId);
	List<Tag> findByVpcId(Long vpcId);
	List<Tag> findBySubnetId(Long subnetId);
	List<Tag> findByDhcpId(Long dhcpId);
	List<Tag> findByStorageId(Long storageId);
	List<Tag> findByKmsId(Long kmsId);
	List<Tag> findByEfsId(Long efsId);
}
