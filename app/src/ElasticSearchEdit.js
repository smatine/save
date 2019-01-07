import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback, FormText, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ElasticSearchEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    text: '',
    vpc: {},
    vpcs: {},
    vpcId : '',
    subnetgroup: {},
    subnetgroups: {},
    subnetgroupId : '',
    prive: true,
    domainName: '', 
    version: '', 
    instanceCount: '', 
    instanceTypes: {},
    nodeInstance: {},
    nodeMaster: {}, 
    nodeInstanceId: '',
    nodeMasterId: '',
    enableDedicatedMaster: false, 
    dedicatedMasterInstanceCount: '', 
    enableZoneAwareness: false, 
    storageType: '', 
    volumeType: '', 
    volumeSize: '', 
    enableEncrypt: false, 
    snapshotConfiguration: '', 
    nodeToNodeEncryption: false,
    provisionedIops: '',
    allowExplicitIndex: true,
    cacheSize:'', 
    maxClauseCount:'',
    accessPolicy:'',
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      subnetgroupId: false,
      domainName: false, 
      version: false,
      instanceCount: false, 
      dedicatedMasterInstanceCount: false,
      storageType: false,
      volumeType: false,
      volumeSize: false,
      snapshotConfiguration: false,
      nodeInstanceId: false,
      nodeMasterId: false,
      provisionedIops: false,
      accessPolicy: false,
      enableZoneAwareness: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const elasticSearch = await (await fetch(`${API_BASE_URL}/elasticSearchs/${this.props.match.params.id}`)).json();
      elasticSearch.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        subnetgroupId: false,
        domainName: false, 
        version: false,
        instanceCount: false, 
        dedicatedMasterInstanceCount: false,
        storageType: false,
        volumeType: false,
        volumeSize: false,
        snapshotConfiguration: false,
        nodeInstanceId: false,
        nodeMasterId: false,
        provisionedIops: false,
        accessPolicy: false,
        enableZoneAwareness: false
      };
      this.setState({item: elasticSearch});

      
      if(elasticSearch.prive) 
      {
        await fetch(API_BASE_URL + '/accounts/' + (elasticSearch.account.id) + '/vpcs',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.vpcs = jsonResult;
          this.setState({item: item});
        });

        await fetch(API_BASE_URL + '/vpcs/' + (elasticSearch.vpc.id) + '/type/ELK' + '/subnetGroups',)
          .then((result) => {
            return result.json();
          }).then((jsonResult) => {
            let item = {...this.state.item};
            item.subnetgroups = jsonResult;
            this.setState({item: item});
        });
        let item = {...this.state.item};
        item.vpcId = elasticSearch.vpc.id;
        item.subnetgroupId = elasticSearch.subnetgroup.id;
        this.setState({item: item});
      }

      let item = {...this.state.item};

      item.accountId = elasticSearch.account.id;
      
      if(item.nodes && item.nodes.length){
        item.nodes.map(n => {  
           if(n.type === 'instance')  
           {
              item.instanceCount = n.instanceCount;
              item.nodeInstanceId = n.instanceType.id;
           }
           else if(n.type === 'master') 
           {
              item.dedicatedMasterInstanceCount = n.instanceCount;
              item.nodeMasterId = n.instanceType.id;

            }
        });
      }


      this.setState({item: item});
      
    }
    else {
      const elasticSearch = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnetgroup: {},
        subnetgroups: {},
        subnetgroupId : '',
        prive: true,
        domainName: '', 
        version: '', 
        instanceCount: '', 
        enableDedicatedMaster: false, 
        dedicatedMasterInstanceCount: '', 
        enableZoneAwareness: false, 
        storageType: '', 
        volumeType: '', 
        volumeSize: '', 
        enableEncrypt: false, 
        snapshotConfiguration: '', 
        nodeToNodeEncryption: false,
        instanceTypes: {},
        nodeInstance: {},
        nodeMaster: {}, 
        nodeInstanceId: '',
        nodeMasterId: '',
        provisionedIops: '',
        allowExplicitIndex: true,
        accessPolicy:'',
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          subnetgroupId: false,
          domainName: false, 
          version: false,
          instanceCount: false, 
          dedicatedMasterInstanceCount: false,
          storageType: false,
          volumeType: false,
          volumeSize: false,
          snapshotConfiguration: false,
          nodeInstanceId: false,
          nodeMasterId: false,
          provisionedIops: false,
          accessPolicy:false,
          enableZoneAwareness:false
        }
      };
      elasticSearch.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          subnetgroupId: false,
          domainName: false, 
          version: false,
          instanceCount: false,
          dedicatedMasterInstanceCount: false,
          storageType: false,
          volumeType: false,
          volumeSize: false,
          snapshotConfiguration: false,
          nodeInstanceId: false,
          nodeMasterId: false,
          provisionedIops: false,
          accessPolicy:false,
          enableZoneAwareness: false
      };
      this.setState({item: elasticSearch});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });
    /*await fetch('/vpcs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    });*/

    await fetch(API_BASE_URL + '/instanceTypes',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.instanceTypes = jsonResult;
      this.setState({item: item});
    });

  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'enableDedicatedMaster')
    {
      item.enableDedicatedMaster = (target.checked) ? true: false;
    }
    else if(name === 'enableZoneAwareness')
    {
      item.enableZoneAwareness = (target.checked) ? true: false;
    } 
    else if(name === 'enableEncrypt')
    {
      item.enableEncrypt = (target.checked) ? true: false;
    }
    else if(name === 'nodeToNodeEncryption')
    {
      item.nodeToNodeEncryption = (target.checked) ? true: false;
    }
    else if(name === 'accessType')
    {
      if(value === 'prive'){
       //hide 
        item.prive = true;
      }
      else
      {
        //show
        item.prive = false;
      }
    }
    else if(name === 'accountId')
    {
       fetch(API_BASE_URL + '/accounts/' + (item.accountId) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });
      item.vpcId = '';

      item.subnetgroupId = '';
      item.subnetgroup = {};
      item.subnetgroups = [];
      
    }
    else if(name === 'vpcId')
    {
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/type/ELK' + '/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          item.subnetgroups = jsonResult;
          this.setState({item: item});
        });
      
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          accountId: true,
          vpcId: true,
          subnetgroupId: true,
          domainName: true, 
          version: true,
          instanceCount: true, 
          dedicatedMasterInstanceCount: true,
          storageType: true,
          volumeType: true,
          volumeSize: true,
          snapshotConfiguration: true,
          nodeInstanceId: true,
          nodeMasterId: true,
          provisionedIops: true,
          accessPolicy: true,
          enableZoneAwareness: true
          
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.domainName, item.version, item.instanceCount, 
                                 item.dedicatedMasterInstanceCount, item.storageType, 
                                 item.volumeType, item.volumeSize, item.snapshotConfiguration, item.nodeInstanceId, item.nodeMasterId, item.enableDedicatedMaster, 
                                 item.provisionedIops, item.accessPolicy, item.enableZoneAwareness, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/elasticSearchs'; 

    item.account={id: item.accountId};
    if(item.prive)
    {
      item.vpc={id: item.vpcId};
      item.subnetgroup={id: item.subnetgroupId};
    } else
    {
      item.vpc=null;
      item.subnetgroup=null;
    }
    
    item.nodeInstance= {"type": "instance", "instanceCount": item.instanceCount, "instanceType": {"id": item.nodeInstanceId}};
    
    if(!item.enableDedicatedMaster) {
      item.nodeMaster = null;
      //item.dedicatedMasterInstanceCount = 0;
    }
    else{
      item.nodeMaster = {"type": "master", "instanceCount": item.dedicatedMasterInstanceCount, "instanceType": {"id": item.nodeMasterId}};
    }
    //console.log("sma=" + item.nodeInstanceId + " " + item.nodeMasterId);
    //return;
    item.nodes = [item.nodeInstance, item.nodeMaster];

    if(item.prive)
    {
        
        await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/elasticSearchs/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/elasticSearchs', {
        method: (item.id) ? 'PUT' : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });
    } else
    {
      await fetch((item.id) ? API_BASE_URL + '/elasticSearch/'+(item.id) : API_BASE_URL + '/elasticSearch', {
        method: (item.id) ? 'PUT' : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });
    } 
    this.props.history.push(hist);
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }

  validate(name, vpcId, subnetgroupId, domainName, version, instanceCount, dedicatedMasterInstanceCount, 
    storageType, volumeType, volumeSize, snapshotConfiguration, nodeInstanceId, nodeMasterId, enableDedicatedMaster, provisionedIops, accessPolicy, enableZoneAwareness, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      subnetgroupId: '',
      domainName: '',
      version: '',
      instanceCount: '',
      dedicatedMasterInstanceCount: '',
      storageType: '',
      volumeType: '',
      volumeSize: '',
      snapshotConfiguration: '',
      nodeInstanceId: '',
      nodeMasterId: '', 
      provisionedIops: '',
      accessPolicy:'',
      enableZoneAwareness:''

    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId should not be null';
      return errors;
    }
    else if(this.state.item.prive && this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.prive && this.state.item.touched.subnetgroupId && subnetgroupId.length === 0){
      errors.subnetgroupId = 'Subnet group should not be null';
      return errors;
    }
    else if(this.state.item.touched.domainName && (domainName.length === 0 /*|| !domainName.match("[a-z][0-9]-")*/)){
      errors.domainName = 'The name must start with a lowercase letter and must be between 3 and 28 characters. Valid characters are a-z (lowercase only), 0-9, and - (hyphen)';
      return errors;
    }
    else if(this.state.item.touched.version && version.length === 0){
      errors.version = 'version should not be null';
      return errors;
    }
    else if(this.state.item.touched.instanceCount && (instanceCount.length === 0 || instanceCount < 0)){
      errors.instanceCount = 'instanceCount should not be null or less than 0';
      return errors;
    }
    else if(this.state.item.touched.nodeInstanceId && nodeInstanceId.length === 0){
      errors.nodeInstanceId = 'nodeInstanceId should not be null';
      return errors;
    }
    else if(enableDedicatedMaster && this.state.item.touched.nodeMasterId && nodeMasterId.length === 0){
      errors.nodeMasterId = 'nodeMasterId should not be null';
      return errors;
    }
    else if(this.state.item.touched.enableZoneAwareness && enableZoneAwareness && (instanceCount == '' || instanceCount % 2 != 0)){
      errors.enableZoneAwareness = 'Zone awareness requires the instance count to be an even number';
      return errors;
    }
    else if(enableDedicatedMaster && this.state.item.touched.dedicatedMasterInstanceCount && dedicatedMasterInstanceCount.length === 0){
      errors.dedicatedMasterInstanceCount = 'dedicatedMasterInstanceCount should not be null';
      return errors;
    }
    else if(this.state.item.touched.storageType && storageType.length === 0){
      errors.storageType = 'storageType should not be null';
      return errors;
    }
    else if(this.state.item.touched.volumeType && volumeType.length === 0){
      errors.volumeType = 'volumeType should not be null';
      return errors;
    }
    else if(this.state.item.touched.volumeSize && (volumeSize.length === 0 || volumeSize < 10 || volumeSize > 512)){
      errors.volumeSize = 'volumeSize should not be between 10 and 512';
      return errors;
    }
    else if(volumeType === 'ISSD' && this.state.item.touched.provisionedIops && (provisionedIops.length === 0 || provisionedIops < 1000 || provisionedIops > 16000)) {
      errors.provisionedIops = 'provisionedIops should not be between 1000 and 16000';
      return errors;
    }
    else if(this.state.item.touched.snapshotConfiguration && snapshotConfiguration.length === 0){
      errors.snapshotConfiguration = 'snapshotConfiguration should not be null';
      return errors;
    }
    else if(this.state.item.touched.accessPolicy && accessPolicy.length === 0){
      errors.accessPolicy = 'accessPolicy should not be null';
      return errors;
    }
    

    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit elasticSearch' : 'Add elasticSearch'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.domainName, item.version, item.instanceCount, 
                                 item.dedicatedMasterInstanceCount, item.storageType, 
                                 item.volumeType, item.volumeSize, item.snapshotConfiguration, item.nodeInstanceId, item.nodeMasterId, item.enableDedicatedMaster, 
                                 item.provisionedIops, item.accessPolicy, item.enableZoneAwareness, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/elasticSearchs";

    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let tri = item.vpcId || '';
    item.vpcId = tri;


    let optss = [];
    if(item.subnetgroups && item.subnetgroups.length){
      item.subnetgroups.map(s => {  
          optss.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let sg = item.subnetgroupId || '';
    item.subnetgroupId = sg;


    let optsi = [];
    if(item.instanceTypes && item.instanceTypes.length){
      item.instanceTypes.map(i => {  
          optsi.push(<option key={i.id} value={i.id}>{i.id} {i.family} {i.type}</option>);
      });
    }
    let iti = item.nodeInstanceId || '';
    item.nodeInstanceId = iti;

    let itm = item.nodeMasterId || '';
    item.nodeMasterId = itm;
    
    const prive = item.prive;
    const vpcsr =  (prive) ? <FormGroup row>
                <Label for="vpcId" sm={2}>Vpcs (*)</Label>
                <Col sm={10}>
                <Input type="select" name="vpcId" id="vpcId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} 
                     valid={errors.vpcId === ''}
                     invalid={errors.vpcId !== ''}
                >
                  <option value="" disabled>Choose</option>
                  {opts}
                </Input>
                
                <FormFeedback>{errors.vpcId}</FormFeedback>
                </Col>
              </FormGroup> : ''
             
    const subnetgroupr = (prive) ? <FormGroup row>
                <Label for="subnetgroupId" sm={2}>Subnet group (*)</Label>
                <Col sm={10}>
                <Input type="select" name="subnetgroupId" id="subnetgroupId"  value={sg} onChange={this.handleChange} onBlur={this.handleBlur('subnetgroupId')}
                     valid={errors.subnetgroupId === ''}
                     invalid={errors.subnetgroupId !== ''}
                >
                  <option value="" disabled>Choose</option>
                  {optss}
                </Input>
                
                <FormFeedback>{errors.subnetgroupId}</FormFeedback>
                </Col>
              </FormGroup> : ''
    
    const dedicatedMasterInstanceType = (item.enableDedicatedMaster) ? <FormGroup row>
              <Label for="nodeMasterId" sm={2}>Instance Type (*)</Label>
              <Col sm={10}>
              <Input type="select" name="nodeMasterId" id="nodeMasterId"  value={itm} onChange={this.handleChange} onBlur={this.handleBlur('nodeMasterId')} 
                   valid={errors.nodeMasterId === ''}
                   invalid={errors.nodeMasterId !== ''}
              >
                <option value="" disabled>Choose</option>
                {optsi}
              </Input>
              
              <FormFeedback>{errors.nodeMasterId}</FormFeedback>
              </Col>
            </FormGroup>  : '';

    const dedicatedMasterInstanceCount = (item.enableDedicatedMaster) ? <FormGroup row>
            <Label for="dedicatedMasterInstanceCount" sm={2}>Dedicated Master InstanceCount (*)</Label>
            <Col sm={10}>
            <Input type="select" name="dedicatedMasterInstanceCount" id="dedicatedMasterInstanceCount" value={item.dedicatedMasterInstanceCount || ''} placeholder="Enter dedicatedMasterInstanceCount"
                   onChange={this.handleChange} onBlur={this.handleBlur('dedicatedMasterInstanceCount')} autoComplete="dedicatedMasterInstanceCount"
                   valid={errors.dedicatedMasterInstanceCount === ''}
                   invalid={errors.dedicatedMasterInstanceCount !== ''}
                   >
                  <option value="" disabled>Choose</option>
                  <option value="3" >3</option>
                  <option value="5" >5</option>
            </Input>
          
           <FormFeedback>{errors.dedicatedMasterInstanceCount}</FormFeedback>
           </Col>
          </FormGroup> : '';

    const provisionedIops  = (item.volumeType === 'ISSD') ? <FormGroup row>
            <Label for="provisionedIops" sm={2}>Provisioned Iops (*)</Label>
            <Col sm={10}>
            <Input  type="number" name="provisionedIops" id="provisionedIops" value={item.provisionedIops || ''} placeholder="Enter provisionedIops" 
                   onChange={this.handleChange}   onBlur={this.handleBlur('provisionedIops')}
                   valid={errors.provisionedIops === ''}
                   invalid={errors.provisionedIops !== ''}
                   />
            
            <FormFeedback>{errors.provisionedIops}</FormFeedback>
            <FormText>The provisioned IOPS value must be an integer between 1000 and 16000.</FormText>
            </Col>
          </FormGroup> : '';


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Label for="name" sm={2}>Name (*)</Label>
             <Col sm={10}>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
             
           <FormFeedback>{errors.name}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="accountId" sm={2}>Account (*)</Label>
            <Col sm={10}>
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optas}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
            </Col>
          </FormGroup>

          <FormGroup tag="fieldset">
            <Label for="accessType">Access Type (*)</Label>
            
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="prive" checked={prive === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                VPC access (Recommended)
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="public" checked={prive === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                Public access
              </Label>
            </FormGroup>
            
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>
          
            {vpcsr}
            {subnetgroupr}
          
          <FormGroup row>
            <Label for="domainName" sm={2}>Domain Name (*)</Label>
            <Col sm={10}>
            <Input type="text" name="domainName" id="domainName" value={item.domainName || ''} placeholder="Enter domainName"
                   onChange={this.handleChange} onBlur={this.handleBlur('domainName')} autoComplete="domainName" 
                   valid={errors.domainName === ''}
                   invalid={errors.domainName !== ''}
            />
           <FormText>The name must start with a lowercase letter and must be between 3 and 28 characters. Valid characters are a-z (lowercase only), 0-9, and - (hyphen).</FormText>
           <FormFeedback>{errors.domainName}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="version" sm={2}>Version (*)</Label>
            <Col sm={10}>
            <Input type="select" name="version" id="version" value={item.version || ''} placeholder="Enter version"
                   onChange={this.handleChange} onBlur={this.handleBlur('version')} autoComplete="version"
                   valid={errors.version === ''}
                   invalid={errors.version !== ''}
                  >
                  <option value="" disabled>Choose</option>
                  <option value="6.3" >6.3</option>
                  <option value="6.2" >6.2</option>
                  <option value="6.0" >6.0</option>
            </Input>
            
           <FormFeedback>{errors.version}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="instanceCount" sm={2}>Instance Count (*)</Label>
            <Col sm={10}>
            <Input type="number" name="instanceCount" id="instanceCount" value={item.instanceCount || ''} placeholder="Enter instanceCount"
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceCount')} autoComplete="instanceCount"
                   valid={errors.instanceCount === ''}
                   invalid={errors.instanceCount !== ''}
            />
            
           <FormFeedback>{errors.instanceCount}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
              <Label for="nodeInstanceId" sm={2}>Instance Type (*)</Label>
              <Col sm={10}>
              <Input type="select" name="nodeInstanceId" id="nodeInstanceId"  value={iti} onChange={this.handleChange} onBlur={this.handleBlur('nodeInstanceId')} 
                   valid={errors.nodeInstanceId === ''}
                   invalid={errors.nodeInstanceId !== ''}
              >
                <option value="" disabled>Choose</option>
                {optsi}
              </Input>
              
              <FormFeedback>{errors.nodeInstanceId}</FormFeedback>
              </Col>
            </FormGroup>


          <FormGroup>
            <Label for="enableDedicatedMaster">Enable Dedicated Master:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="enableDedicatedMaster" id="enableDedicatedMaster" 
                    onChange={this.handleChange} onBlur={this.handleBlur('enableDedicatedMaster')} 
                    checked={item.enableDedicatedMaster === true}/>
          </FormGroup>
  
          {dedicatedMasterInstanceType}   
          {dedicatedMasterInstanceCount}

          
          <FormGroup>
            <Label for="enableZoneAwareness" >Enable Zone Awareness:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="enableZoneAwareness" id="enableZoneAwareness" 
                    onChange={this.handleChange} onBlur={this.handleBlur('enableZoneAwareness')} 
                    checked={item.enableZoneAwareness === true}
                    valid={errors.enableZoneAwareness === ''}
                    invalid={errors.enableZoneAwareness !== ''}
                    />
            <FormText>Zone awareness requires the instance count to be an even number.</FormText>
            <FormFeedback>{errors.enableZoneAwareness}</FormFeedback>
          </FormGroup>
    

          <FormGroup row>
            <Label for="storageType" sm={2}>Storage Type (*)</Label>
            <Col sm={10}>
            <Input type="select" name="storageType" id="storageType" value={item.storageType || ''} placeholder="Enter storageType"
                   onChange={this.handleChange} onBlur={this.handleBlur('storageType')} autoComplete="storageType"
                   valid={errors.storageType === ''}
                   invalid={errors.storageType !== ''}
                   >
                   <option value="" disabled>Choose</option>
                   <option value="EBS">EBS</option>
           </Input>
           
           <FormFeedback>{errors.storageType}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="volumeType" sm={2}>Volume Type (*)</Label>
            <Col sm={10}>
            <Input type="select" name="volumeType" id="volumeType" value={item.volumeType || ''} placeholder="Enter volumeType"
                   onChange={this.handleChange} onBlur={this.handleBlur('volumeType')} autoComplete="volumeType"
                   valid={errors.volumeType === ''}
                   invalid={errors.volumeType !== ''}
                   >
                   <option value="" disabled>Choose</option>
                   <option value="SSD">General Purpose (SSD)</option>
                   <option value="ISSD">Provisioned Iops (SSD)</option>
                   <option value="MAG">Magnetics</option>
           </Input>
           
           <FormFeedback>{errors.volumeType}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="volumeSize" sm={2}>Volume Size </Label>
            <Col sm={10}>
            <Input type="number" name="volumeSize" id="volumeSize" value={item.volumeSize || ''} placeholder="Enter volumeSize"
                   onChange={this.handleChange} onBlur={this.handleBlur('volumeSize')} autoComplete="volumeSize"
                   valid={errors.volumeSize === ''}
                   invalid={errors.volumeSize !== ''}
            />
           <FormText>Volume size must be an integer between 10 and 512(*)</FormText>
           <FormFeedback>{errors.volumeSize}</FormFeedback>
           </Col>
          </FormGroup>

          {provisionedIops}

          <FormGroup>
            <Label for="enableEncrypt">Enable Encrypt:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="enableEncrypt" id="enableEncrypt" 
                    onChange={this.handleChange} onBlur={this.handleBlur('enableEncrypt')} 
                    checked={item.enableEncrypt === true}/>
           
          </FormGroup>
    
          <FormGroup row>
            <Label for="snapshotConfiguration" sm={2}>Snapshot Configuration : Automated snapshot start hour(*)</Label>
            <Col sm={10}>
            <Input type="select" name="snapshotConfiguration" id="snapshotConfiguration" value={item.snapshotConfiguration || ''} placeholder="Enter snapshotConfiguration"
                   onChange={this.handleChange} onBlur={this.handleBlur('snapshotConfiguration')} autoComplete="snapshotConfiguration"
                   valid={errors.snapshotConfiguration === ''}
                   invalid={errors.snapshotConfiguration !== ''}
                  >
                  <option value="" disabled>Choose</option>
                  <option value="00:00">00:00 UTC (default)</option>
                  <option value="01:00">01:00 UTC</option>
                  <option value="02:00">02:00 UTC</option>
                  <option value="03:00">03:00 UTC</option>
                  <option value="04:00">04:00 UTC</option>
                  <option value="05:00">05:00 UTC</option>
                  <option value="06:00">06:00 UTC</option>
                  <option value="07:00">07:00 UTC</option>
                  <option value="08:00">08:00 UTC</option>
                  <option value="09:00">09:00 UTC</option>
                  <option value="10:00">10:00 UTC</option>
                  <option value="11:00">11:00 UTC</option>
                  <option value="12:00">12:00 UTC</option>
                  <option value="13:00">13:00 UTC</option>
                  <option value="14:00">14:00 UTC</option>
                  <option value="15:00">15:00 UTC</option>
                  <option value="16:00">16:00 UTC</option>
                  <option value="17:00">17:00 UTC</option>
                  <option value="18:00">18:00 UTC</option>
                  <option value="19:00">19:00 UTC</option>
                  <option value="20:00">20:00 UTC</option>
                  <option value="21:00">21:00 UTC</option>
                  <option value="22:00">22:00 UTC</option>
                  <option value="23:00">23:00 UTC</option>
           </Input>
           
           <FormFeedback>{errors.snapshotConfiguration}</FormFeedback>
           </Col>
          </FormGroup>


          

          <FormGroup>
            <Label for="nodeToNodeEncryption">Node To Node Encryption:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="nodeToNodeEncryption" id="nodeToNodeEncryption" 
                    onChange={this.handleChange} onBlur={this.handleBlur('nodeToNodeEncryption')} 
                    checked={item.nodeToNodeEncryption === true}/>
          </FormGroup>
    
          <FormGroup>
          <Label for="l">Advanced Options</Label>
          </FormGroup>

          <FormGroup row>
            <Label for="allowExplicitIndex" sm={3}>rest.action.multi.allow_explicit_index</Label>
            <Col sm={9}>
            <Input type="select" name="allowExplicitIndex" id="allowExplicitIndex" value={item.allowExplicitIndex || ''} placeholder="Enter allowExplicitIndex"
                   onChange={this.handleChange} onBlur={this.handleBlur('allowExplicitIndex')} autoComplete="allowExplicitIndex"
                  >
                  <option value="true">TRUE</option>
                  <option value="false">FALSE</option>
           </Input>
           
           <FormText>If you want to configure access to domain sub-resources, such as specific indices, you must set this property to "false". 
           Setting this property to "false" prevents users from bypassing access control for sub-resources. The default value for this setting is "true".</FormText>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="cacheSize" sm={3}>indices.fielddata.cache.size</Label>
            <Col sm={9}>
            <Input type="number" name="cacheSize" id="cacheSize" value={item.cacheSize || ''}
                   onChange={this.handleChange} autoComplete="cacheSize"/>
            <FormText>Specifies the percentage of heap space that is allocated to fielddata. By default, this setting is unbounded.</FormText>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="maxClauseCount" sm={3}>indices.query.bool.max_clause_count</Label>
            <Col sm={9}>
            <Input type="number" name="maxClauseCount" id="maxClauseCount" value={item.maxClauseCount || ''}
                   onChange={this.handleChange} autoComplete="maxClauseCount"/>
            
            <FormText>Specifies the maximum number of allowed boolean clauses in a query. By default, this setting is 1024.</FormText>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="accessPolicy" sm={2}>Access Policy(*)</Label>
            <Col sm={10}>
            <Input type="textarea" name="accessPolicy" id="accessPolicy" value={item.accessPolicy || ''} placeholder="Enter accessPolicy"
                   onChange={this.handleChange} onBlur={this.handleBlur('accessPolicy')} autoComplete="accessPolicy"
                   valid={errors.accessPolicy === ''}
                   invalid={errors.accessPolicy !== ''}
            />
            
           <FormFeedback>{errors.accessPolicy}</FormFeedback>
           </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="text" sm={2}>Description</Label>
            <Col sm={10}>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>

            

          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ElasticSearchEdit);