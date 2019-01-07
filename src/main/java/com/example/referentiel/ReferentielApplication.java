package com.example.referentiel;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.DescribeInstancesResult;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.Upload;
import com.example.referentiel.model.Account;
import com.example.referentiel.model.Ami;
import com.example.referentiel.model.AutoScalingGroup;
import com.example.referentiel.model.Az;
import com.example.referentiel.model.Cidr;
import com.example.referentiel.model.Dhcp;
import com.example.referentiel.model.Ecc;
import com.example.referentiel.model.Efs;
import com.example.referentiel.model.ElasticCache;
import com.example.referentiel.model.ElasticSearch;
import com.example.referentiel.model.EndPoint;
import com.example.referentiel.model.Group;
import com.example.referentiel.model.InstanceType;
import com.example.referentiel.model.Kms;
import com.example.referentiel.model.LaunchConfiguration;
import com.example.referentiel.model.Lb;
import com.example.referentiel.model.Listener;
import com.example.referentiel.model.Nacl;
import com.example.referentiel.model.Node;
import com.example.referentiel.model.Peering;
import com.example.referentiel.model.PeeringAccepterExternal;
import com.example.referentiel.model.PeeringAccepterInternal;
import com.example.referentiel.model.Policy;
import com.example.referentiel.model.Product;
import com.example.referentiel.model.Rds;
import com.example.referentiel.model.Region;
import com.example.referentiel.model.Role;
import com.example.referentiel.model.Route;
import com.example.referentiel.model.RouteTable;
import com.example.referentiel.model.Rule;
import com.example.referentiel.model.RuleSg;
import com.example.referentiel.model.Sg;
import com.example.referentiel.model.Storage;
import com.example.referentiel.model.StorageAcl;
import com.example.referentiel.model.Subnet;
import com.example.referentiel.model.SubnetCidr;
import com.example.referentiel.model.SubnetGroup;
import com.example.referentiel.model.Tag;
import com.example.referentiel.model.Target;
import com.example.referentiel.model.TargetGroup;
import com.example.referentiel.model.Trigramme;
import com.example.referentiel.model.User;
import com.example.referentiel.model.Vpc;
import com.example.referentiel.repository.AccountRepository;
import com.example.referentiel.repository.AmiRepository;
import com.example.referentiel.repository.AutoScalingGroupRepository;
import com.example.referentiel.repository.AzRepository;
import com.example.referentiel.repository.CidrRepository;
import com.example.referentiel.repository.DhcpRepository;
import com.example.referentiel.repository.EccRepository;
import com.example.referentiel.repository.EfsRepository;
import com.example.referentiel.repository.ElasticCacheRepository;
import com.example.referentiel.repository.ElasticSearchRepository;
import com.example.referentiel.repository.EndPointRepository;
import com.example.referentiel.repository.GroupRepository;
import com.example.referentiel.repository.InstanceTypeRepository;
import com.example.referentiel.repository.KmsRepository;
import com.example.referentiel.repository.LaunchConfigurationRepository;
import com.example.referentiel.repository.LbRepository;
import com.example.referentiel.repository.ListenerRepository;
import com.example.referentiel.repository.NaclRepository;
import com.example.referentiel.repository.NodeRepository;
import com.example.referentiel.repository.PeeringAccepterExternalRepository;
import com.example.referentiel.repository.PeeringAccepterInternalRepository;
import com.example.referentiel.repository.PeeringRepository;
import com.example.referentiel.repository.PolicyRepository;
import com.example.referentiel.repository.ProductRepository;
import com.example.referentiel.repository.RdsRepository;
import com.example.referentiel.repository.RegionRepository;
import com.example.referentiel.repository.RoleRepository;
import com.example.referentiel.repository.RouteRepository;
import com.example.referentiel.repository.RouteTableRepository;
import com.example.referentiel.repository.RuleRepository;
import com.example.referentiel.repository.RuleSgRepository;
import com.example.referentiel.repository.SgRepository;
import com.example.referentiel.repository.StorageAclRepository;
import com.example.referentiel.repository.StorageRepository;
import com.example.referentiel.repository.SubnetCidrRepository;
import com.example.referentiel.repository.SubnetGroupRepository;
import com.example.referentiel.repository.SubnetRepository;
import com.example.referentiel.repository.TagRepository;
import com.example.referentiel.repository.TargetGroupRepository;
import com.example.referentiel.repository.TargetRepository;
import com.example.referentiel.repository.TrigrammeRepository;
import com.example.referentiel.repository.UserRepository;
import com.example.referentiel.repository.VpcRepository;

@SpringBootApplication
@EnableJpaAuditing
@Transactional
public class ReferentielApplication implements CommandLineRunner{
	
	 
	public static void main(String[] args) {
		SpringApplication.run(ReferentielApplication.class, args);
	}
	
	@Autowired
    private RegionRepository regionRepository;
    
	@Autowired
    private AzRepository azRepository;
	
	@Autowired
    private CidrRepository cidrRepository;
	
	@Autowired
    private SubnetCidrRepository subnetCidrRepository;
	
	@Autowired
    private TrigrammeRepository trigrammeRepository;
	
	@Autowired
    private ProductRepository productRepository;
	
	@Autowired
    private AccountRepository accountRepository;
	
	@Autowired
    private VpcRepository vpcRepository;
	
	@Autowired
    private SubnetRepository subnetRepository;
	
	@Autowired
    private SubnetGroupRepository subnetGroupRepository;
	
	@Autowired
    private RdsRepository rdsRepository;
	
	@Autowired
    private EfsRepository efsRepository;
	
	@Autowired
    private ElasticCacheRepository elasticCacheRepository;
	
	@Autowired
    private ElasticSearchRepository elasticSearchRepository;
	
	@Autowired
    private NaclRepository naclRepository;
	
	@Autowired
    private RuleRepository ruleRepository;
	
	@Autowired
    private TagRepository tagRepository;
	
	@Autowired
    private SgRepository sgRepository;
	
	@Autowired
    private RuleSgRepository ruleSgRepository;
	
	@Autowired
    private RouteRepository routeRepository;
	
	@Autowired
    private RouteTableRepository routeTableRepository;
	
	@Autowired
    private PeeringRepository peeringRepository;
	
	@Autowired
    private PeeringAccepterExternalRepository peeringAccepterExternalRepository;
	
	@Autowired
    private PeeringAccepterInternalRepository peeringAccepterInternalRepository;
	
	@Autowired
    private TargetGroupRepository targetGroupRepository;
	
	@Autowired
    private TargetRepository targetRepository;
	
	@Autowired
    private ListenerRepository listenerRepository;
	
	@Autowired
    private LbRepository lbRepository;
	  
	@Autowired
    private InstanceTypeRepository instanceTypeRepository;
	
	@Autowired
    private AmiRepository amiRepository;
	
	@Autowired
    private EccRepository eccRepository;
	
	@Autowired
    private NodeRepository nodeRepository;
	
	@Autowired
    private LaunchConfigurationRepository launchConfigurationRepository;
	
	@Autowired
    private AutoScalingGroupRepository autoScalingGroupRepository;
	
	@Autowired
    private PolicyRepository policyRepository;
	
	@Autowired
    private RoleRepository roleRepository;
	
	@Autowired
    private GroupRepository groupRepository;
	
	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private EndPointRepository endPointRepository;
	
	@Autowired
    private DhcpRepository dhcpRepository;
	
	@Autowired
    private KmsRepository kmsRepository;
	
	@Autowired
    private StorageRepository storageRepository;
	
	@Autowired
    private StorageAclRepository storageAclRepository;
	
	 @Override
	 public void run(String... args) throws Exception {
		 
		InstanceType instanceType = new InstanceType();
		instanceType.setFamily("001");
     	instanceType.setType("001");
     	instanceType.setVcpus(1l);
     	instanceType.setMemory(1l);
     	instanceType.setInstanceStorage("001");
     	instanceType.setEbsOptimized(true);
     	instanceType.setNetworkPerformance("001");
     	instanceType = instanceTypeRepository.save(instanceType);
     	
		 Region  region = new Region();
		 region.setName("eu-west-1");
		 region.setDescription("test");
		 Region r = regionRepository.save(region);
	     
		 Ami ami = new Ami();
		 ami.setAmiId("001");
     	 ami.setName("001");
     	 ami.setText("001");
     	 ami.setRegion(r);
     	 ami = amiRepository.save(ami);
     	 
		 Az az = new Az();
		 az.setName("az001");
		 az.setDescription("az001");
		 az.setRegion(r);
		 Az az1 = azRepository.save(az);
		 az = new Az();
		 az.setName("az002");
		 az.setDescription("az002");
		 az.setRegion(r);
		 Az az2 = azRepository.save(az);
		 az = new Az();
		 az.setName("az003");
		 az.setDescription("az003");
		 az.setRegion(r);
		 Az az3 = azRepository.save(az);
		 
		 Cidr cidr = new Cidr();
		 cidr.setCidr("10.10.10.10/24");
		 cidr.setEnv("DEV");
		 cidr.setText("10.10.10.10/24 DEV");
		 cidr.setRegion(r);
		 Cidr c = cidrRepository.save(cidr);
		 
		 Cidr cidr2 = new Cidr();
		 cidr2.setCidr("11.11.11.11/24");
		 cidr2.setEnv("DEV");
		 cidr2.setText("11.11.11.11/24 DEV");
		 cidr2.setRegion(r);
		 cidr2 = cidrRepository.save(cidr2);
		 
		 SubnetCidr subnetCidr = new  SubnetCidr();
		 subnetCidr.setCidr(c);
		 subnetCidr.setSubnetCidr("10.10.10.10/25");
		 subnetCidr.setText("10.10.10.10/25");
		 SubnetCidr sc1 = subnetCidrRepository.save(subnetCidr);
		 subnetCidr = new  SubnetCidr();
		 subnetCidr.setCidr(c);
		 subnetCidr.setSubnetCidr("10.10.10.10/26");
		 subnetCidr.setText("10.10.10.10/26");
		 SubnetCidr sc2 = subnetCidrRepository.save(subnetCidr);
		 subnetCidr = new  SubnetCidr();
		 subnetCidr.setCidr(c);
		 subnetCidr.setSubnetCidr("10.10.10.10/27");
		 subnetCidr.setText("10.10.10.10/27");
		 SubnetCidr sc3 = subnetCidrRepository.save(subnetCidr);
		 
		 
		 Trigramme trigramme = new Trigramme();
		 trigramme.setName("TRI");
		 trigramme.setDescription("tri");
		 trigramme.setIrtCode("12345");
		 trigramme.setMailList("cc@cc.com");
		 trigramme.setOwner("oo@oo.com");
		 Trigramme t = trigrammeRepository.save(trigramme);
		 
		 Trigramme trigramme2 = new Trigramme();
		 trigramme2.setName("TRA");
		 trigramme2.setDescription("tra");
		 trigramme2.setIrtCode("12345");
		 trigramme2.setMailList("cc@dd.com");
		 trigramme2.setOwner("oo@oo.com");
		 Trigramme t2 = trigrammeRepository.save(trigramme2);
		 
		 Product product = new Product();
		 product.setName("PRD");
		 product.setMailList("mm@mm.com");
		 product.setType("ttt");
		 product.setTrigramme(t);
		 product.setBastion("bastion");
		 Product p = productRepository.save(product);
		 
		 Product product2 = new Product();
		 product2.setName("PRR");
		 product2.setMailList("mm@mm.com");
		 product2.setType("ttt");
		 product2.setTrigramme(t);
		 product2.setBastion("bastion");
		 Product p2 = productRepository.save(product2);
		 
		 Account account = new Account();
		 account.setNumAccount("123456789012");
		 account.setEnv("DEV");
		 //account.setProduct(p);
		 account.setTrigramme(trigramme);
		 account.setMailList("aa@aa.com");
		 account.setAlias("alias");
		 account.getProducts().add(product);
		 product.getAccounts().add(account);
		 account.getProducts().add(product2);
		 product2.getAccounts().add(account);
		 Account a = accountRepository.save(account);
		 
		 Account account2 = new Account();
		 account2.setNumAccount("222222222222");
		 account2.setEnv("DEV");
		 //account2.setProduct(p);
		 account2.setTrigramme(trigramme);
		 account2.setMailList("aa@aa.com");
		 account2.setAlias("alias");
		 account2.getProducts().add(product);
		 account2.getProducts().add(product2);
		 product.getAccounts().add(account2);
		 product2.getAccounts().add(account2);
		 account2 = accountRepository.save(account2);
		 
		 Vpc vpc = new Vpc(); 
		 vpc.setAccount(a);
		 vpc.setCidr(c);
		 vpc.setName("111");
		 vpc.getProducts().add(product);
		 product.getVpcs().add(vpc);
		 vpc.getProducts().add(product2);
		 product2.getVpcs().add(vpc);
		 Vpc v = vpcRepository.save(vpc);
		 
		 Vpc vpc2 = new Vpc();
		 vpc2.setAccount(account2);
		 vpc2.setCidr(cidr2);
		 vpc2.setName("222");
		 vpc2.getProducts().add(product);
		 product.getVpcs().add(vpc2);
		 vpc2.getProducts().add(product2);
		 product2.getVpcs().add(vpc2);
		 vpc2 = vpcRepository.save(vpc2);
		 
		 //subnet
		 
		 Subnet subnet = new Subnet();
		 subnet.setName("s001");
		 subnet.setType("ttt");
		 subnet.setVpc(v);
		 subnet.setAccount(account);
		 subnet.setsCidr(sc1);
		 subnet.setAz(az1);
		 subnet.getProducts().add(product);
		 product.getSubnets().add(subnet);
		 subnet.getProducts().add(product2);
		 product2.getSubnets().add(subnet);
		 Subnet s1 = subnetRepository.save(subnet);
		 
		 subnet = new Subnet();
		 subnet.setName("s002");
		 subnet.setType("ttt");
		 subnet.setVpc(v);
		 subnet.setAccount(account);
		 subnet.setsCidr(sc2);
		 subnet.setAz(az2);
		 subnet.getProducts().add(product);
		 product.getSubnets().add(subnet);
		 Subnet s2 = subnetRepository.save(subnet);
		 
		 subnet = new Subnet();
		 subnet.setName("s003");
		 subnet.setType("ttt");
		 subnet.setVpc(v);
		 subnet.setAccount(account);
		 subnet.setsCidr(sc3);
		 subnet.setAz(az3);
		 subnet.getProducts().add(product2);
		 product2.getSubnets().add(subnet);
		 Subnet s3 = subnetRepository.save(subnet);
		 
		 
		 //security group
		 Sg secg = new Sg();
		 secg.setName("Sg001");
		 secg.setNameTag("Sg001 tag");
		 secg.setText("Sg001");
		 secg.setVpc(v);
		 secg.setAccount(account);
		 secg.setProduct(product);
		 Sg secg1 = sgRepository.save(secg);
		
		 //
		 SubnetGroup subnetGroup = new SubnetGroup();
		 subnetGroup.setVpc(v);
		 subnetGroup.setAccount(account);
		 subnetGroup.setName("sg001");
		 subnetGroup.setType("RDS");
		 subnetGroup.setProduct(product);
		 
		 List<Subnet> subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 
		 subnetGroup.setSubnets(subnets);
		 SubnetGroup sg = subnetGroupRepository.save(subnetGroup);
		 s1.getSubnetgroup().add(sg);
		 s2.getSubnetgroup().add(sg);
		 s3.getSubnetgroup().add(sg);
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		 
		 
		 Optional<SubnetGroup> sgd = subnetGroupRepository.findById((long) 1000);
		 Iterator<Subnet> itt = sgd.get().getSubnets().iterator();
		 while(itt.hasNext()) {
			Subnet sbb = (Subnet)itt.next();
			//System.out.println("subnet after:" + sbb.getId());
		 }
		
		 Rds rds = new Rds();
		 rds.setName("R001");
		 rds.setText("R001");
		 rds.setInstanceType(instanceType);
		 secg1.getRdss().add(rds);
		 rds.getSgs().add(secg1);
		 rds.setAz(az2);
		 rds.setAccount(account);
		 rds.setVpc(v);
		 rds.setProduct(product);
		 
		 rds.setEnv("Production");
     	 rds.setType("PostgreSQL");
     	 rds.setDbEngineVesion("6.1");
     	 rds.setMultiAz(true);
     	 rds.setStorageType("General");
     	 rds.setAlocatedStorage(100l);
     	 rds.setProvisionedIops(200l);
     	 rds.setDbInstanceIdentifier("toto");
     	 rds.setMasterUserName("name");
     	 rds.setMasterPassword("password");
     	 rds.setMasterConfirmPassword("password");
     	
		 rds.setSubnetgroup(sg);
		 Rds rds1 = rdsRepository.save(rds);
		 Optional<Rds> rd = rdsRepository.findById(rds1.getId());
		 //System.out.println("Rds after:" + rd.get().getSubnetgroup().getName());
		 Optional<SubnetGroup> sgg = subnetGroupRepository.findById(sg.getId());
		 Iterator<Rds> itg = sgg.get().getRdss().iterator();
		 while(itg.hasNext()) {
			Rds rr = (Rds)itg.next();
			System.out.println("Rds after:" + rr.getId());
		 }
		/*
		 //
		 subnetGroup = new SubnetGroup();
		 subnetGroup.setVpc(v);
		 subnetGroup.setAccount(account);
		 subnetGroup.setName("sg003");
		 subnetGroup.setType("ECC");
		 s1.getSubnetgroup().add(subnetGroup);
		 s2.getSubnetgroup().add(subnetGroup);
		 s3.getSubnetgroup().add(subnetGroup);
		 subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 
		 subnetGroup.setSubnets(subnets);
		 sg = subnetGroupRepository.save(subnetGroup);
		 
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		 
		 ElasticCache elasticCache = new ElasticCache();
		 elasticCache.setName("ElasticCache001");
		 elasticCache.setText("ElasticCache001");
		 elasticCache.setAccount(account);
		 elasticCache.setVpc(v);
		 elasticCache.setSubnetgroup(sg);
		 ElasticCache elasticCache1 = elasticCacheRepository.save(elasticCache);
		
		 //
		 subnetGroup = new SubnetGroup();
		 subnetGroup.setVpc(v);
		 subnetGroup.setAccount(account);
		 subnetGroup.setName("sg004");
		 subnetGroup.setType("ELK");
		 s1.getSubnetgroup().add(subnetGroup);
		 s2.getSubnetgroup().add(subnetGroup);
		 s3.getSubnetgroup().add(subnetGroup);
		 subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 
		 subnetGroup.setSubnets(subnets);
		 sg = subnetGroupRepository.save(subnetGroup);
		 
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		
		 //elasticSearch
		
		 Node node = new Node();
		 node.setType("instance");
		 node.setInstanceCount(2l);
		 node.setInstanceType(instanceType);
		 
		 Node node2 = new Node();
		 node2.setType("master");
		 node2.setInstanceCount(3l);
		 node2.setInstanceType(instanceType);
		 
		 ElasticSearch elasticSearch = new ElasticSearch();
		 elasticSearch.setName("ElasticSearch001");
		 elasticSearch.setText("ElasticSearch001");
		 elasticSearch.setPrive(true);
		 elasticSearch.setVpc(v);
		 elasticSearch.setAccount(account);
		 elasticSearch.setSubnetgroup(sg);
		 elasticSearch.setDomainName("sma");
     	 elasticSearch.setVersion("6.2");
     	 
     	 elasticSearch.setEnableDedicatedMaster(true);
     	 
     	 elasticSearch.setEnableZoneAwareness(true);
     	 elasticSearch.setStorageType("EBS");
     	 elasticSearch.setVolumeType("SSD");
     	 elasticSearch.setVolumeSize(30l);
     	 elasticSearch.setEnableEncrypt(true);
     	 elasticSearch.setSnapshotConfiguration("23:00");
     	 elasticSearch.setNodeToNodeEncryption(true);
     	 elasticSearch.setAccessPolicy("toto");
     	 
     	 elasticSearch.getNodes().add(node);
     	 elasticSearch.getNodes().add(node2);
     	 node.setElasticSearch(elasticSearch);
     	 node2.setElasticSearch(elasticSearch);
		 ElasticSearch elasticSearch1 = elasticSearchRepository.save(elasticSearch);
		 
		 node = new Node();
		 node.setType("instance");
		 node.setInstanceCount(4l);
		 node.setInstanceType(instanceType);
		 
		 node2 = new Node();
		 node2.setType("master");
		 node2.setInstanceCount(5l);
		 node2.setInstanceType(instanceType);
		 
		 elasticSearch = new ElasticSearch();
		 elasticSearch.setAccount(account);
		 elasticSearch.setName("ElasticSearch002");
		 elasticSearch.setText("ElasticSearch002");
		 elasticSearch.setPrive(false);
		 elasticSearch.setDomainName("sma2");
     	 elasticSearch.setVersion("6.1");
     	 
     	 elasticSearch.setEnableDedicatedMaster(true);
     	 
     	 elasticSearch.setEnableZoneAwareness(true);
     	 elasticSearch.setStorageType("EBS");
     	 elasticSearch.setVolumeType("SSD");
     	 elasticSearch.setVolumeSize(30l);
     	 elasticSearch.setEnableEncrypt(true);
     	 elasticSearch.setSnapshotConfiguration("01:00");
     	 elasticSearch.setNodeToNodeEncryption(true);
     	 elasticSearch.setAccessPolicy("toto");
		 //elasticSearch.setVpc(v);
		 //elasticSearch.setSubnetgroup(sg);
     	 elasticSearch.getNodes().add(node);
     	 elasticSearch.getNodes().add(node2);
     	 node.setElasticSearch(elasticSearch);
     	 node2.setElasticSearch(elasticSearch);
		 elasticSearch1 = elasticSearchRepository.save(elasticSearch);
		
		 //NACL
		 
		 Nacl nacl = new Nacl();
		 nacl.setName("Nacl001");
		 nacl.setText("Nacl001");
		 nacl.setVpc(v);
		 nacl.setAccount(account);
		 nacl.setDef(false);
		 
		 subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 nacl.setSubnets(subnets);
		 s1.getNacls().add(nacl);
		 s2.getNacls().add(nacl);
		 s3.getNacls().add(nacl);
		 
		 Nacl nacl1 = naclRepository.save(nacl);
		 
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		 
		 //ajout des subnets assoc
		 Optional<Nacl> nac = naclRepository.findById(nacl1.getId());
		 Iterator<Subnet> itnac = nac.get().getSubnets().iterator();
		 while(itnac.hasNext()) {
			Subnet sub = (Subnet)itnac.next();
			System.out.println("Nac subnet after:" + sub.getId() + " " + sub.getName());
		 }
		 Optional<Subnet> sub = subnetRepository.findById(s1.getId());
		 Iterator<Nacl> itsub = sub.get().getNacls().iterator();
		 while(itsub.hasNext()) {
			Nacl nacc = (Nacl)itsub.next();
			System.out.println("Nac subnet after 2:" + nacc.getId() + " " + nacc.getName());
		 }
		 
		 //
		 Tag tag = new Tag();
		 tag.setKey("key 001");
		 tag.setValue("value 001");
		 tag.setNacl(nacl1);
		 Tag tag1 = tagRepository.save(tag);
		 tag1 = new Tag();
		 tag1.setKey("key 002");
		 tag1.setValue("value 002");
		 tag1.setNacl(nacl1);
		 tag1 = tagRepository.save(tag1);
		 //	 
		 
		 Rule rule = new Rule();
		 rule.setText("Rule001");
		 rule.setNacl(nacl1);
		 rule.setType("INBOUND");
		 rule.setNumber("*");
     	 rule.setRuleType("ALL Traffic");
     	 rule.setProtocol("HTTPS");
     	 rule.setPortRange("80");
     	 rule.setCidr("10.10.10.10/24");
     	 rule.setAllow("Deny");
     	
		 Rule rule1 = ruleRepository.save(rule);
		 Tag tag2 = new Tag();
		 tag2.setKey("key sg 001");
		 tag2.setValue("value sg 001");
		 tag2.setSg(secg1);
		 Tag tag3 = tagRepository.save(tag2);
		 
		 tag3 = new Tag();
		 tag3.setKey("key sg 002");
		 tag3.setValue("value sg 002");
		 tag3.setSg(secg1);
		 tag3 = tagRepository.save(tag3);
		 
		 RuleSg ruleSg = new RuleSg();
		 ruleSg.setText("Rule001");
		 ruleSg.setSg(secg1);
		 ruleSg.setType("INBOUND");
		 ruleSg.setRuleType("ALL Traffic");
     	 ruleSg.setProtocol("HTTPS");
     	 ruleSg.setPortRange("80");
     	 ruleSg.setCidr("10.10.10.10/24");
     	 
     	
		 RuleSg ruleSg1 = ruleSgRepository.save(ruleSg);
		
		 //routetabe
		 
		 RouteTable routeTable = new RouteTable();
		 routeTable.setName("NRouteTable001");
		 routeTable.setText("RouteTable001");
		 routeTable.setVpc(v);
		 routeTable.setAccount(account);
		 routeTable.setDef(false);
		 
		 subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 routeTable.setSubnets(subnets);
		 s1.getRoutetables().add(routeTable);
		 s2.getRoutetables().add(routeTable);
		 s3.getRoutetables().add(routeTable);
		 
		 RouteTable routeTable1 = routeTableRepository.save(routeTable);
		 
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		 
		 //ajout des subnets assoc
		 Optional<RouteTable> routet = routeTableRepository.findById(routeTable1.getId());
		 Iterator<Subnet> itrt = routet.get().getSubnets().iterator();
		 while(itrt.hasNext()) {
			Subnet subrt = (Subnet)itrt.next();
			System.out.println("Routetable subnet after:" + subrt.getId() + " " + subrt.getName());
		 }
		 Optional<Subnet> subrt = subnetRepository.findById(s1.getId());
		 Iterator<RouteTable> itrts = subrt.get().getRoutetables().iterator();
		 while(itsub.hasNext()) {
			RouteTable rt = (RouteTable)itrts.next();
			System.out.println("RouteTable subnet after 2:" + rt.getId() + " " + rt.getName());
		 }
		 
		 //
		 tag = new Tag();
		 tag.setKey("key 001");
		 tag.setValue("value 001");
		 tag.setRouteTable(routeTable1);
		 tag1 = tagRepository.save(tag);
		 tag1 = new Tag();
		 tag1.setKey("key 002");
		 tag1.setValue("value 002");
		 tag1.setRouteTable(routeTable1);
		 tag1 = tagRepository.save(tag1);
		 //	 
		 
		 Route route = new Route();
		 route.setText("Rule001");
		 route.setRouteTable(routeTable1);
		 route.setPropagation(false);
		 route.setDestination("10.10.10.10/24");
		 route.setTarget("Local");
		 route.setTargetType("L");
     	
		 Route route1 = routeRepository.save(route);
		  
		
		 //Peering
		 
		 Peering peering = new Peering();
		 peering.setName("PEERING001");
		 peering.setText("PEERING001");
		 peering.setType("External");
		 peering.setVpc(v);
		 peering.setAccount(account);
		 
		 PeeringAccepterExternal peeringAccepterExternal = new PeeringAccepterExternal();
		 peeringAccepterExternal.setOwner("peeringAccepterExternal001");
		 peeringAccepterExternal.setVpcId("10.10.10.10/24");
		 peeringAccepterExternal.setRegion(r);
		 peeringAccepterExternal.setPeering(peering);
		 peering.setPeeringAccepterExternal(peeringAccepterExternal);
		 
		 
		 peeringAccepterExternal = peeringAccepterExternalRepository.save(peeringAccepterExternal);
		 peering = peeringRepository.save(peering);
		 
		 
		 peering = new Peering();
		 peering.setName("PEERING002");
		 peering.setText("PEERING002");
		 peering.setType("Internal");
		 peering.setVpc(v);
		 peering.setAccount(account);
		 PeeringAccepterInternal peeringAccepterInternal = new PeeringAccepterInternal();
		 peeringAccepterInternal.setVpc(v);
		 peeringAccepterInternal.setPeering(peering);
		 peering.setPeeringAccepterInternal(peeringAccepterInternal);
		 
		 peeringAccepterInternal = peeringAccepterInternalRepository.save(peeringAccepterInternal);
		 peering = peeringRepository.save(peering);
		 
		 tag = new Tag();
		 tag.setKey("key peering 001");
		 tag.setValue("value peering 001");
		 tag.setPeering(peering);
		 tag1 = tagRepository.save(tag);
		 tag1 = new Tag();
		 tag1.setKey("key peering 002");
		 tag1.setValue("value peering 002");
		 tag1.setPeering(peering);
		 tag1 = tagRepository.save(tag1);
		 
		 //TargetGroup + listener + loadbalancer
		 
		
		 //ECC
		 
		 Ecc ecc = new Ecc();
		 ecc.setName("ecc01");
		 ecc.setAmi(ami);
		 ecc.setVpc(v);
		 ecc.setAccount(account);
		 ecc.setInstanceType(instanceType);
		 ecc.setSubnet(s1);
		 
		 secg1.getEccs().add(ecc);
		 ecc.getSgs().add(secg1);
		 ecc.setAutoAssignPublicIp("Enable");
     	 ecc.setShutdownBehaviour("Stop");
     	 ecc.setEnableTerminationProtection(true);
     	 ecc.setEncoded64(true);
     	 ecc.setMonitoring(true);
     	 ecc.setUserData(true);
     	 ecc.setUserDataText("coco");
     	 ecc = eccRepository.save(ecc);
     	 Optional<Ecc> ecc2 = eccRepository.findById(ecc.getId());
     	 
     	 List<Sg> eccSgs = ecc2.get().getSgs();
		 Iterator<Sg> iteccsg = eccSgs.iterator();
    	 while(iteccsg.hasNext()) {
    		Sg s = (Sg)iteccsg.next();
    		System.out.println("ecc sg=" + s.getName());
    	 }
    	 Optional<Sg> secgg1 = sgRepository.findById(secg1.getId());
    	 List<Ecc> eccSggs = secgg1.get().getEccs();
    	 Iterator<Ecc> iteccsgg = eccSggs.iterator();
    	 while(iteccsgg.hasNext()) {
     		Ecc e = (Ecc)iteccsgg.next();
     		System.out.println("2ecc sg=" + e.getId());
     	 }
		

		 TargetGroup targetGroup = new TargetGroup();
		 targetGroup.setName("name targetGroup 001");
	     targetGroup.setText("text targetGroup 001");
	     	            
	     targetGroup.setProtocole("HTTPS");
	     targetGroup.setPort((long) 443);
	     targetGroup.setHcprotocole("HTTP");
	     targetGroup.setHcpath("/");
	     targetGroup.setType("instance");
	     targetGroup.setAhportoverride(false);
	     targetGroup.setAhport((long) 443);
	     targetGroup.setAhhealthythreshold((long) 5);
	     targetGroup.setAhuhealthythreshold((long) 2);
	     
	     targetGroup.setAhtimeout((long) 5);
	     targetGroup.setAhtinterval((long) 30);
	     targetGroup.setAhsucesscode("200-400");
	     targetGroup.setVpc(v);
	     targetGroup.setAccount(account);
	     targetGroup = targetGroupRepository.save(targetGroup);
	     
	     TargetGroup targetGroup2 = new TargetGroup(); 
	     targetGroup2.setName("name targetGroup 002");
	     targetGroup2.setText("text targetGroup 002");
	     	            
	     targetGroup2.setProtocole("HTTPS");
	     targetGroup2.setPort((long) 443);
	     targetGroup2.setHcprotocole("HTTP");
	     targetGroup2.setHcpath("/");
	     targetGroup2.setType("instance");
	     targetGroup2.setAhportoverride(true);
	     targetGroup2.setAhport((long) 80);
	     targetGroup2.setAhhealthythreshold((long) 5);
	     targetGroup2.setAhuhealthythreshold((long) 2);
	     targetGroup2.setAhtimeout((long) 5);
	     targetGroup2.setAhtinterval((long) 30);
	     targetGroup2.setAhsucesscode("200-400");
	     targetGroup2.setVpc(v);
	     targetGroup2.setAccount(account);
	     targetGroup2 = targetGroupRepository.save(targetGroup2);
	     
	     tag = new Tag();
		 tag.setKey("key 001");
		 tag.setValue("value 001");
		 tag.setTargetGroup(targetGroup);
		 tag1 = tagRepository.save(tag);
		 tag1 = new Tag();
		 tag1.setKey("key 002");
		 tag1.setValue("value 002");
		 tag1.setTargetGroup(targetGroup2);
		 tag1 = tagRepository.save(tag1);
		 //
	     Target target = new Target();
	     target.setPort((long) 80);
	     target.setEcc(ecc);
	     target.setTargetGroup(targetGroup);
	     target = targetRepository.save(target);
	     //
	     target = new Target();
	     target.setPort((long) 81);
	     target.setEcc(ecc);
	     target.setTargetGroup(targetGroup);
	     target = targetRepository.save(target);
	     
	     target = new Target();
	     target.setPort((long) 88);
	     target.setEcc(ecc);
	     target.setTargetGroup(targetGroup2);
	     target = targetRepository.save(target);
	     
	    
	     
	  //lb
	     Lb lb= new Lb();
	     lb.setName("Lb 001");
	     lb.setText("Lb 001");
	     lb.setType("ALB");
	     lb.setScheme(true);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     List<Subnet> subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     lb.getSgs().add(secg1);
	     secg1.getLbs().add(lb);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
	     
	     
	     
	     lb= new Lb();
	     lb.setName("Lb 002");
	     lb.setText("Lb 002");
	     lb.setType("NLB");
	     lb.setScheme(true);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
	   
	     lb= new Lb();
	     lb.setName("Lb 003");
	     lb.setText("Lb 003");
	     lb.setType("ELB");
	     lb.setScheme(true);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
	     
	     lb= new Lb();
	     lb.setName("Lb 004");
	     lb.setText("Lb 004");
	     lb.setType("ALB");
	     lb.setIpType("ipv6");
	     lb.setScheme(false);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
	     
	     lb= new Lb();
	     lb.setName("Lb 005");
	     lb.setText("Lb 005");
	     lb.setType("NLB");
	     lb.setScheme(false);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
	     
	     lb= new Lb();
	     lb.setName("Lb 006");
	     lb.setText("Lb 006");
	     lb.setType("ELB");
	     lb.setScheme(false);
	     lb.setVpc(v);
	     lb.setAccount(account);
	     subs = subnetRepository.findByVpcId(v.getId());
	     lb.setSubnets(subs);
	     for(int i = 0; i < subs.size(); i++){
	    	 Subnet sublb = (Subnet)subs.get(i);
	    	 sublb.getLbs().add(lb); 
	     }
	     lb = lbRepository.save(lb);
		 
	     Listener listener = new Listener();
	     listener.setProtocole("TCP");
	     listener.setPort((long) 80);
	     listener.setLb(lb);
	     
	     listener.setTargetGroup(targetGroup);
	     listener = listenerRepository.save(listener);
	     
	     //targetGroup.setListener(listener);
	     //targetGroup = targetGroupRepository.save(targetGroup);
	     Optional<Listener> listener2 = listenerRepository.findById((long) 1000);
	     TargetGroup tg = listener2.get().getTargetGroup();
	     if(tg != null)
	     {
	    	 System.out.println("TargetGroup=" + tg.getId());
	     } else {
	    	 System.out.println("TargetGroup null");
	     }
	     
	     
	     tag = new Tag();
		 tag.setKey("key 001");
		 tag.setValue("value 001");
		 tag.setLb(lb);
		 tag1 = tagRepository.save(tag);
		 tag1 = new Tag();
		 tag1.setKey("key 002");
		 tag1.setValue("value 002");
		 tag1.setLb(lb);
		 tag1 = tagRepository.save(tag1);
		
		
    	 //launchconfiguration
    	LaunchConfiguration launchConfiguration = new LaunchConfiguration();
    	launchConfiguration.setVpc(vpc);
    	launchConfiguration.setAccount(account);
    	launchConfiguration.setName("001");
     	launchConfiguration.setKernalId("001 id");
     	launchConfiguration.setRamDiskId("001 ram");
     	launchConfiguration.setPurchasingOption(false);
     	launchConfiguration.setIamRole("001  role");
     	launchConfiguration.setIpAddressType("01");
     	launchConfiguration.setEncoded64(false);
     	launchConfiguration.setMonitoring(false);
     	launchConfiguration.setUserData(true);
     	launchConfiguration.setUserDataText("toto");
     	launchConfiguration.setAmi(ami);
     	launchConfiguration.setInstanceType(instanceType);
     	
     	secg1.getLaunchConfigurations().add(launchConfiguration);
     	launchConfiguration.getSgs().add(secg1);
     	//launchConfiguration.setSgs(sgs);
     	launchConfiguration = launchConfigurationRepository.save(launchConfiguration);
		
     	
     	
     	//AutoScalingGroup
     	//name, vpc, launchConfiguration, subnets, groupSize, loadBalancing, targetGroup, healthCheckType, healthCheckGracePeriod, 
        //instanceProtection, 
        //serviceLinkedRole, createAutoScalingGroup
     	AutoScalingGroup autoScalingGroup = new AutoScalingGroup();
     	autoScalingGroup.setName("asg 001");
     	autoScalingGroup.setVpc(vpc);
     	autoScalingGroup.setAccount(account);
     	autoScalingGroup.setLaunchConfiguration(launchConfiguration);
     	
     	autoScalingGroup.setGroupSize(3l);
     	autoScalingGroup.setLoadBalancing(false);
     	
     	autoScalingGroup.setHealthCheckType("EC2");
     	autoScalingGroup.setHealthCheckGracePeriod(200l);
     	autoScalingGroup.setInstanceProtection("inst prt");
     	autoScalingGroup.setServiceLinkedRole("role");
     	autoScalingGroup.setCreateAutoScalingGroup(false);
     	
     	subnets = new ArrayList<>(); 
		subnets.add(s1);
		subnets.add(s2);
	    subnets.add(s3);
		autoScalingGroup.setSubnets(subnets);
		s1.getAutoScalingGroups().add(autoScalingGroup);
		s2.getAutoScalingGroups().add(autoScalingGroup);
		s3.getAutoScalingGroups().add(autoScalingGroup);
     	
		List<TargetGroup> targetGroups = new ArrayList<>(); 
		targetGroups.add(targetGroup);
		autoScalingGroup.setTargetGroups(targetGroups);
		targetGroup.getAutoScalingGroups().add(autoScalingGroup);
		
     	autoScalingGroup = autoScalingGroupRepository.save(autoScalingGroup);
		 
		s1 = subnetRepository.save(s1);
		s2 = subnetRepository.save(s2);
		s3 = subnetRepository.save(s3);
		targetGroup = targetGroupRepository.save(targetGroup);
     	
     	
     	tag = new Tag();
     	tag.setText("tag asg");
    	tag.setKey("asg");
    	tag.setValue("asg value");
    	tag.setAutoScalingGroup(autoScalingGroup);
    	
        tag = tagRepository.save(tag);
        
        // policy
        Policy policy = new Policy();
        policy.setName("policy name 001");
        
        policy.setPolicyJson("json");
        policy.setAccount(account);
        policy = policyRepository.save(policy);
        policy = new Policy();
        policy.setName("policy name 002");
        
        policy.setPolicyJson("json2");
        policy.setAccount(account);
        policy = policyRepository.save(policy);
        
        
        //endpoint
        EndPoint endPoint = new EndPoint();
        endPoint.setName("endpoint name001");
        endPoint.setServiceName("com.amazonaws.eu-west-1.s3");
        
        endPoint.setFullAccess(true);
        endPoint.setPolicy(policy);
        endPoint.setRouteTable(routeTable);
        endPoint.setVpc(vpc);
        endPoint.setAccount(account);
        endPoint = endPointRepository.save(endPoint);
        
        
        //Role
        Role role = new  Role();
        role.setName("role 001");
        role.setServiceName("Ec2");
        role.setDescription("desc");
        role.setAccount(account);
        
        List<Policy> policys = new ArrayList<>(); 
        policys.add(policy);
		role.setPolicys(policys);
		policy.getRoles().add(role);

        role = roleRepository.save(role);
        policy = policyRepository.save(policy);
        
        //Group
        Group group = new Group();
        group.setName("group 001");
        group.setAccount(account);
        
        policys = new ArrayList<>(); 
        policys.add(policy);
		group.setPolicys(policys);
		policy.getGroups().add(group);

        group = groupRepository.save(group);
        policy = policyRepository.save(policy);
        
        //user
        User user = new User();
        user.setName("user 001");
        user.setAccount(account);
        
        List<Group> groups = new ArrayList<>(); 
        groups.add(group);
		user.setGroups(groups);
		group.getUsers().add(user);

        user = userRepository.save(user);
        group = groupRepository.save(group);
        
        
        //dhcp
        Dhcp dhcp = new Dhcp();
        dhcp.setName("dhcp 001");
    	dhcp.setDomainName("domaine001");
    	dhcp.setDomainNameServers("server1; server2");
    	dhcp.setNtpServers("server3");
    	dhcp.setNetBiosNameServers("server4");
    	dhcp.setNetBiosNodeType("type");
    	dhcp.setVpc(vpc);
    	dhcp.setAccount(account);
    	dhcp = dhcpRepository.save(dhcp);
        
    	// kms
    	Kms kms = new Kms();
    	kms.setAlias("kms alias 001");
        kms.setText("kms 001");
        kms.setKeyMaterialOrigin("key mat 001");
        kms.setPolicy(policy);
        kms.setAccount(account);
        
        List<Role> roles = new ArrayList<>(); 
        roles.add(role);
        kms.setRoles(roles);
        List<User> users = new ArrayList<>(); 
        users.add(user);
        kms.setUsers(users);
        
        kms = kmsRepository.save(kms);
        role = roleRepository.save(role);
        user = userRepository.save(user);
     	
        
        // storage
        
        Storage storage = new Storage();
        storage.setText("s3");
    	storage.setName("s3 001");
    	storage.setVersionning(true);
    	storage.setCloudWatchMetrics(true);
    	storage.setRegion(region);
    	storage.setEncryption(true);
    	storage.setEncryptionType("AWS-KMS");
    	storage.setKms(kms);
    	storage.setServerAccessLoging(true);
    	storage.setTargetPrefix("prefix");
    	storage.setAccount(account);
    	//storage.setGrantPublicReadAccess(true);
    	storage.setGrantAmazonS3ReadAccess(true);
    	
    	storage = storageRepository.save(storage);
    	storage.setStorageTarget(storage);
    	storage = storageRepository.save(storage);
    	
    	
    	StorageAcl storageAcl = new StorageAcl();
    	storageAcl.setType("Internal");
    	storageAcl.setAccount(storage.getAccount());
    	storageAcl.setExternalAccount(null);
    	storageAcl.setRead(true);
    	storageAcl.setWrite(true);
    	storageAcl.setStorage(storage);
    	storageAcl = storageAclRepository.save(storageAcl);
    	
    	storageAcl = new StorageAcl();
    	storageAcl.setType("External");
    	storageAcl.setAccount(null);
    	storageAcl.setExternalAccount("accountxxxxx");
    	storageAcl.setRead(true);
    	storageAcl.setWrite(true);
    	storageAcl.setStorage(storage);
    	storageAcl = storageAclRepository.save(storageAcl);
    	
    	//EFS

		 subnetGroup = new SubnetGroup();
		 subnetGroup.setVpc(v);
		 subnetGroup.setAccount(account);
		 subnetGroup.setName("sg002");
		 subnetGroup.setType("EFS");
		 s1.getSubnetgroup().add(subnetGroup);
		 s2.getSubnetgroup().add(subnetGroup);
		 s3.getSubnetgroup().add(subnetGroup);
		 subnets = new ArrayList<>(); 
		 subnets.add(s1);
		 subnets.add(s2);
		 subnets.add(s3);
		 
		 subnetGroup.setSubnets(subnets);
		 sg = subnetGroupRepository.save(subnetGroup);
		 
		 s1 = subnetRepository.save(s1);
		 s2 = subnetRepository.save(s2);
		 s3 = subnetRepository.save(s3);
		 //
		 Efs efs = new Efs();
		 efs.setName("EFS001");
		 efs.setText("EFS001");
		 efs.setVpc(v);
		 efs.setAccount(account);
		 efs.setSubnetgroup(sg);
		 
		 efs.setKms(kms);
     	 efs.setKmsExterne("");
     	 efs.setEncryption(true);
     	 efs.setEncryptionType("Kms");
     	 efs.setPerformanceMode("Default");
     	 efs.setThroughputMode("Bursting");
     	 efs.setProvisionedIo(0l);
		 
		 Efs efs1 = efsRepository.save(efs);
		 
		 efs = new Efs();
		 efs.setName("EFS002");
		 efs.setText("EFS002");
		 efs.setVpc(v);
		 efs.setAccount(account);
		 efs.setSubnetgroup(sg);
		 
		 efs.setKms(null);
		 efs.setEncryption(true);
		 efs.setEncryptionType("KmsExterne");
     	 efs.setKmsExterne("kms externe");
     	 efs.setPerformanceMode("MaxIo");
     	 efs.setThroughputMode("Provisioned");
     	 efs.setProvisionedIo(1024l);
		 
		 efs1 = efsRepository.save(efs);
		 
           */
	
		 
	 }
	 
}
