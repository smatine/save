import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RdsEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
    account: {},
    accounts: {},
    accountId : '',
    vpc: {},
    vpcs: {},
    vpcId : '',
    subnetgroup: {},
    subnetgroups: {},
    subnetgroupId : '',
    sgss: {},
    sgs: [],
    sgId: [],
    instanceType: '', 
    az:'',
    multiAz: true,
    env:'', 
    type:'', 
    dbEngineVesion:'',  
    storageType:'',  
    dbInstanceIdentifier:'',
    masterUserName:'', 
    masterPassword:'', 
    masterConfirmPassword:'',
    alocatedStorage:'', 
    provisionedIops:'',
  	product: {},
  	products: {},
  	productId : '',
    touched: {
      name: false,
      vpcId: false,
      subnetgroupId: false,
      accountId: false,
      sgId: false,
      instanceTypeId: false,
      azId: false,
      env: false, type: false, dbEngineVesion: false,  storageType: false,  dbInstanceIdentifier: false,
      masterUserName: false, masterPassword: false, masterConfirmPassword: false,
      alocatedStorage: false, provisionedIops: false, productId: false
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
      const rds = await (await fetch(`${API_BASE_URL}/rdss/${this.props.match.params.id}`)).json();
      rds.touched = {
        name: false,
        vpcId: false,
        subnetgroupId: false,
        accountId: false,
        sgId: false,
        instanceTypeId: false,
        azId: false,
        env: false, type: false, dbEngineVesion: false,  storageType: false,  dbInstanceIdentifier: false,
        masterUserName: false, masterPassword: false, masterConfirmPassword: false,
        alocatedStorage: false, provisionedIops: false, productId: false
      };
      this.setState({item: rds});
      
      await fetch(API_BASE_URL + '/vpcs/' + (rds.vpc.id) + '/type/RDS' + '/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetgroups = jsonResult;
          this.setState({item: item});
      });

      await fetch(API_BASE_URL + '/accounts/' + (rds.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });
      
      
      await fetch(API_BASE_URL + '/vpcs/' + (rds.vpc.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
      });


      let item = {...this.state.item};
      item.instanceTypeId = rds.instanceType.id;
      item.accountId = rds.account.id;
      item.vpcId = rds.vpc.id;
      item.productId = rds.product.id;
      item.products = rds.vpc.products;
      item.subnetgroupId = rds.subnetgroup.id;
      item.azId = rds.az.id;

      var vals = [];
      var sg = rds.subnetgroup.subnets;
      sg.map(s => { 
        vals.push(s.az);
      });
      item.azs = vals;

      var values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;

      this.setState({item: item});
      
    }
    else {
      const rds = {
        name: '',
        text: '',
        account: {},
        accounts: {},
        accountId : '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnetgroup: {},
        subnetgroups: {},
        subnetgroupId : '',
        sgss: {},
        sgs: [],
        sgId: [],
        instanceType: '', 
        az:'',
        multiAz: true,
        env:'', 
        type:'', 
        dbEngineVesion:'',  
        storageType:'',  
        dbInstanceIdentifier:'',
        masterUserName:'', 
        masterPassword:'', 
        masterConfirmPassword:'',
        alocatedStorage:'', 
        provisionedIops:'',
      	product: {},
      	products: {},
      	productId : '',
        touched: {
          name: false,
          vpcId: false,
          subnetgroupId: false,
          accountId: false,
          sgId: false,
          instanceTypeId: false,
          azId: false,
          env: false, type: false, dbEngineVesion: false,  storageType: false,  dbInstanceIdentifier: false,
          masterUserName: false, masterPassword: false, masterConfirmPassword: false,
          alocatedStorage: false, provisionedIops: false, productId: false
        }
      };
      rds.touched = {
          name: false,
          vpcId: false,
          subnetgroupId: false,
          accountId: false,
          sgId: false,
          instanceTypeId: false,
          azId: false,
          env: false, type: false, dbEngineVesion: false,  storageType: false,  dbInstanceIdentifier: false,
          masterUserName: false, masterPassword: false, masterConfirmPassword: false,
          alocatedStorage: false, provisionedIops: false, productId: false
      };
      this.setState({item: rds});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });

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

    if(name === 'accountId')
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
      item.subnetgroups = [];
      item.sgId = '';
      item.sgs = [];
      item.sgss = [];
      item.azId = '';
      item.azs = [];
      item.productId = '';
    }

    if(name === 'vpcId')
    {
      
      fetch(API_BASE_URL + '/vpcs/' + item.vpcId + '/type/RDS' + '/subnetGroups',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        item.subnetgroups = jsonResult;
        this.setState({item: item});
      });

      fetch(API_BASE_URL + '/vpcs/' + item.vpcId + '/sgs',)
      .then((result) => { 
        return result.json();
      }).then((jsonResult) => {
        item.sgss = jsonResult;
        this.setState({item: item});
      }); 
      
      fetch(API_BASE_URL + '/vpcs/' + (item.vpcId),)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.products = jsonResult.products;
        this.setState({item: item});
      });
    }

    if(name === 'subnetgroupId')
    {
      fetch(API_BASE_URL + '/subnetGroups/' + item.subnetgroupId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        
        var vals = [];
        var sg = jsonResult.subnets;
        sg.map(s => { 
          vals.push(s.az);
        });
        item.azs = vals;
        this.setState({item: item});
      });

    }
    
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          vpcId: true,
          subnetgroupId: true,
          accountId: false,
          sgId: true,
          instanceTypeId: true,
          azId: true,
          env: true, type: true, dbEngineVesion: true,  storageType: true,  dbInstanceIdentifier: true,
          masterUserName: true, masterPassword: true, masterConfirmPassword: true,
          alocatedStorage: true, provisionedIops: true, productId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.accountId, item.sgId, item.instanceTypeId, item.azId,
          item.env, item.type, item.dbEngineVesion,  item.storageType,  item.dbInstanceIdentifier,
          item.masterUserName, item.masterPassword, item.masterConfirmPassword,
          item.alocatedStorage, item.provisionedIops, item.productId);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/rdss'; 

    item.account={id: item.accountId};
    item.vpc={id: item.vpcId};
    item.product={id: item.productId};
    item.subnetgroup={id: item.subnetgroupId};
    item.az={id: item.azId};
    item.instanceType = {id: item.instanceTypeId};

    var values = [];
    if(item.sgs && item.sgs.length){
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sg= values;
    }
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/rdss/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/rdss', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push(hist);
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }

  validate(name, vpcId, subnetgroupId, accountId, sgId, instanceTypeId, azId, env, type, dbEngineVesion, storageType,  dbInstanceIdentifier,
          masterUserName, masterPassword, masterConfirmPassword,
          alocatedStorage, provisionedIops, productId) {

    const errors = {
      name: '' ,
      vpcId: '',
      subnetgroupId: '',
      accountId: '',
      sgId: '',
      instanceTypeId: '',
      azId: '',
      env: '', type: '', dbEngineVesion: '', storageType: '',  dbInstanceIdentifier: '',
      masterUserName: '', masterPassword: '', masterConfirmPassword: '',
      alocatedStorage: '', provisionedIops: '', productId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }

    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId should not be null';
      return errors;
    }

    if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    if(this.state.item.touched.productId && productId.length === 0){
        errors.productId = 'productId should not be null';
        return errors;
      }
    
    if(this.state.item.touched.subnetgroupId && subnetgroupId.length === 0){
      errors.azId = 'azId should not be null';
      return errors;
    }
    if(this.state.item.touched.azId &&azId.length === 0){
      errors.subnetgroupId = 'Subnet group should not be null';
      return errors;
    }
    if(this.state.item.touched.sgId && this.state.item.sgs.length <= 0){
      errors.sgId = 'sgId should not be null';
      return errors;
    }
    if(this.state.item.touched.instanceTypeId && instanceTypeId.length === 0){
      errors.instanceTypeId = 'instanceTypeId should not be null';
      return errors;
    }

    if(this.state.item.touched.env && env.length === 0){
      errors.env = 'env should not be null';
      return errors;
    }
    if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }
    if(this.state.item.touched.dbEngineVesion && dbEngineVesion.length === 0){
      errors.dbEngineVesion = 'dbEngineVesion should not be null';
      return errors;
    }
    if(this.state.item.touched.storageType && storageType.length === 0){
      errors.storageType = 'storageType should not be null';
      return errors;
    }
    if(this.state.item.touched.dbInstanceIdentifier && dbInstanceIdentifier.length === 0){
      errors.dbInstanceIdentifier = 'dbInstanceIdentifier should not be null';
      return errors;
    }
    if(this.state.item.touched.masterUserName && masterUserName.length === 0){
      errors.masterUserName = 'masterUserName should not be null';
      return errors;
    }
    if(this.state.item.touched.masterPassword && masterPassword.length === 0){
      errors.masterPassword = 'masterPassword should not be null';
      return errors;
    }
    if(this.state.item.touched.masterConfirmPassword && masterConfirmPassword.length === 0){
      errors.masterConfirmPassword = 'masterConfirmPassword should not be null';
      return errors;
    }
    /*if(this.state.item.touched.alocatedStorage && alocatedStorage.length === 0){
      errors.alocatedStorage = 'alocatedStorage should not be null';
      return errors;
    }
    if(this.state.item.touched.provisionedIops && provisionedIops.length === 0){
      errors.provisionedIops = 'provisionedIops should not be null';
      return errors;
    }*/
    return errors;
  }

  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'sgId')
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.sgss && item.sgss.length){
              item.sgss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.sgs = values;
      }
      this.setState({item});
  };

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit rds' : 'Add rds'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.accountId, item.sgId, item.instanceTypeId, item.azId, item.env, 
    	  item.type, item.dbEngineVesion,  item.storageType,  item.dbInstanceIdentifier,
          item.masterUserName, item.masterPassword, item.masterConfirmPassword,
          item.alocatedStorage, item.provisionedIops, item.productId);
    
    
    
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/rdss";

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



    let optsg = [];  
    let optsgs = [];
    if(item.sgss && item.sgss.length){
      item.sgss.map(s => {  
          if(item.sgs && item.sgs.length) item.sgs.map(ss => {
             if(s.id == ss.id) {
               optsgs.push({value: s.id, label: s.name});
             }
          });
          optsg.push({value: s.id, label: s.name});
      });
    }
    const securityGroup = <FormGroup>
            <Label for="sgId">Security Group (*)</Label>
            <Select name="sgId" id="sgId"  placeholder="Enter Security group" isMulti isSearchable
              value={optsgs}
              onChange={e => this.onOptionChange("sgId",e)}
              onBlur={this.handleBlur('sgId')}
              options={optsg}
            />
            <FormFeedback>{errors.sgId}</FormFeedback>
          </FormGroup>;

    let optInstanceTypes = [];
    if(item.instanceTypes && item.instanceTypes.length){
      item.instanceTypes.map(s => {  
          optInstanceTypes.push(<option key={s.id} value={s.id}>{s.id} {s.type}</option>);
      });
    }
    let instanceType = item.instanceTypeId || '';
    item.instanceTypeId = instanceType;

    let optAzs = [];
    if(item.azs && item.azs.length){
      item.azs.map(s => {  
          optAzs.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let az = item.azId || '';
    item.azId = az;

    let optps = [];
    if(item.products && item.products.length){
      item.products.map(s => {  
          optps.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let product = item.productId || '';
    item.productId = product;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="accountId">Account (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optas}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vpcId">Vpcs (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>
          
          <FormGroup>
          <Label for="productId">Products (*)</Label>
          <Input type="select" name="productId" id="productId"  value={product} onChange={this.handleChange} onBlur={this.handleBlur('productId')}
               valid={errors.productId === ''}
               invalid={errors.productId !== ''}
          >
            <option value="" disabled>Choose</option>
            {optps}
          </Input>
          <FormFeedback>{errors.productId}</FormFeedback>
        </FormGroup>
        
         
         <FormGroup>
            <Label for="subnetgroupId">Subnet group (*)</Label>
            <Input type="select" name="subnetgroupId" id="subnetgroupId"  value={sg} onChange={this.handleChange} onBlur={this.handleBlur('subnetgroupId')}
                 valid={errors.subnetgroupId === ''}
                 invalid={errors.subnetgroupId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.subnetgroupId}</FormFeedback>
          </FormGroup>

           <FormGroup > 
            <Label for="">multiAz:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="multiAz" id="multiAz" 
                    onChange={this.handleChange} onBlur={this.handleBlur('multiAz')} 
                    checked={item.multiAz === true}/>
          </FormGroup>

          <FormGroup>
            <Label for="azId">Az (*)</Label>
            <Input type="select" name="azId" id="azId" value={item.azId || ''} placeholder="Enter azId" 
                   onChange={this.handleChange} onBlur={this.handleBlur('azId')} autoComplete="azId"
                   valid={errors.azId === ''}
                   invalid={errors.azId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optAzs}
            </Input>
           <FormFeedback>{errors.azId}</FormFeedback>
          </FormGroup>

          {securityGroup}

          <FormGroup>
            <Label for="instanceTypeId">Instance Type (*)</Label>
            <Input type="select" name="instanceTypeId" id="instanceTypeId" value={item.instanceTypeId || ''} placeholder="Enter instanceType" 
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceTypeId')} autoComplete="instanceTypeId"
                   valid={errors.instanceTypeId === ''}
                   invalid={errors.instanceTypeId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optInstanceTypes}
            </Input>
           <FormFeedback>{errors.instanceTypeId}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="env">Env (*)</Label>
            <Input type="text" name="env" id="env" value={item.env || ''} placeholder="Enter env"
                   onChange={this.handleChange} onBlur={this.handleBlur('env')} autoComplete="env"
                   valid={errors.env === ''}
                   invalid={errors.env !== ''}
            />
           <FormFeedback>{errors.env}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="type">Type (*)</Label>
            <Input type="text" name="type" id="type" value={item.type || ''} placeholder="Enter type"
                   onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                   valid={errors.type === ''}
                   invalid={errors.type !== ''}
            />
           <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="dbEngineVesion">DbEngine Vesion (*)</Label>
            <Input type="text" name="dbEngineVesion" id="dbEngineVesion" value={item.dbEngineVesion || ''} placeholder="Enter dbEngineVesion"
                   onChange={this.handleChange} onBlur={this.handleBlur('dbEngineVesion')} autoComplete="dbEngineVesion"
                   valid={errors.dbEngineVesion === ''}
                   invalid={errors.dbEngineVesion !== ''}
            />
           <FormFeedback>{errors.dbEngineVesion}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="storageType">Storage Type (*)</Label>
            <Input type="text" name="storageType" id="storageType" value={item.storageType || ''} placeholder="Enter storageType"
                   onChange={this.handleChange} onBlur={this.handleBlur('storageType')} autoComplete="storageType"
                   valid={errors.storageType === ''}
                   invalid={errors.storageType !== ''}
            />
           <FormFeedback>{errors.storageType}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="dbInstanceIdentifier">DbInstance Identifier (*)</Label>
            <Input type="text" name="dbInstanceIdentifier" id="dbInstanceIdentifier" value={item.dbInstanceIdentifier || ''} placeholder="Enter dbInstanceIdentifier"
                   onChange={this.handleChange} onBlur={this.handleBlur('dbInstanceIdentifier')} autoComplete="dbInstanceIdentifier"
                   valid={errors.dbInstanceIdentifier === ''}
                   invalid={errors.dbInstanceIdentifier !== ''}
            />
           <FormFeedback>{errors.dbInstanceIdentifier}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="masterUserName">Master User Name (*)</Label>
            <Input type="text" name="masterUserName" id="masterUserName" value={item.masterUserName || ''} placeholder="Enter masterUserName"
                   onChange={this.handleChange} onBlur={this.handleBlur('masterUserName')} autoComplete="masterUserName"
                   valid={errors.masterUserName === ''}
                   invalid={errors.masterUserName !== ''}
            />
           <FormFeedback>{errors.masterUserName}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="masterPassword">Master Password (*)</Label>
            <Input type="text" name="masterPassword" id="masterPassword" value={item.masterPassword || ''} placeholder="Enter masterPassword"
                   onChange={this.handleChange} onBlur={this.handleBlur('masterPassword')} autoComplete="masterPassword"
                   valid={errors.masterPassword === ''}
                   invalid={errors.masterPassword !== ''}
            />
           <FormFeedback>{errors.masterPassword}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="masterConfirmPassword">Master Confirm Password (*)</Label>
            <Input type="text" name="masterConfirmPassword" id="masterConfirmPassword" value={item.masterConfirmPassword || ''} placeholder="Enter masterConfirmPassword"
                   onChange={this.handleChange} onBlur={this.handleBlur('masterConfirmPassword')} autoComplete="masterConfirmPassword"
                   valid={errors.masterConfirmPassword === ''}
                   invalid={errors.masterConfirmPassword !== ''}
            />
           <FormFeedback>{errors.masterConfirmPassword}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="alocatedStorage">Alocated Storage (*)</Label>
            <Input type="number" name="alocatedStorage" id="alocatedStorage" value={item.alocatedStorage || ''} placeholder="Enter alocatedStorage"
                   onChange={this.handleChange} onBlur={this.handleBlur('alocatedStorage')} autoComplete="alocatedStorage"
                   valid={errors.alocatedStorage === ''}
                   invalid={errors.alocatedStorage !== ''}
            />
           <FormFeedback>{errors.alocatedStorage}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="provisionedIops">Provisioned Iops (*)</Label>
            <Input type="number" name="provisionedIops" id="provisionedIops" value={item.provisionedIops || ''} placeholder="Enter provisionedIops"
                   onChange={this.handleChange} onBlur={this.handleBlur('provisionedIops')} autoComplete="provisionedIops"
                   valid={errors.provisionedIops === ''}
                   invalid={errors.provisionedIops !== ''}
            />
           <FormFeedback>{errors.provisionedIops}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
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

export default withRouter(RdsEdit);