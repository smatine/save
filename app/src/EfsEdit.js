import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class EfsEdit extends Component {

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
    performanceMode: 'Default', 
    throughputMode: 'Bursting', 
    provisionedIo: 0, 
    encryption: false,
    encryptionType: 'Kms', 
    kmsId:'',
    kms: {},
    kmss: [],
    kmsExterne: '',
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      subnetgroupId: false,
      performanceMode: false, 
      throughputMode: false, 
      provisionedIo: false, 
      kmsId: false,
      kmsExterne: false
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
      const efs = await (await fetch(`${API_BASE_URL}/efss/${this.props.match.params.id}`)).json();
      efs.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        subnetgroupId: false,
        performanceMode: false, 
        throughputMode: false, 
        provisionedIo: false, 
        kmsId: false,
        kmsExterne: false
      };
      this.setState({item: efs});
      
      await fetch(API_BASE_URL + '/accounts/' + (efs.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await fetch(API_BASE_URL + '/vpcs/' + (efs.vpc.id) + '/type/EFS' +'/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetgroups = jsonResult;
          this.setState({item: item});
      });

      let item = {...this.state.item};
      item.vpcId = efs.vpc.id;
      item.accountId = efs.account.id;
      item.subnetgroupId = efs.subnetgroup.id;
      if(efs.kms) item.kmsId = efs.kms.id;

      fetch(API_BASE_URL + '/accounts/' + (efs.vpc.account.id) + '/kmss',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.kmss = jsonResult;
          this.setState({item: item});
      });
      this.setState({item: item});
      
    }
    else {
      const efs = {
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
        performanceMode: 'Default', 
        throughputMode: 'Bursting', 
        provisionedIo: 0, 
        encryption: false, 
        encryptionType: 'Kms',
        kmsId:'',
        kms: {},
        kmss: [],
        kmsExterne: '',
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          subnetgroupId: false,
          performanceMode: false, 
          throughputMode: false, 
          provisionedIo: false, 
          kmsId: false,
          kmsExterne: false
        }
      };
      efs.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          subnetgroupId: false,
          performanceMode: false, 
          throughputMode: false, 
          provisionedIo: false, 
          kmsId: false,
          kmsExterne: false
      };
      this.setState({item: efs});
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
    })*/

  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'encryption')
    {
      item.encryption = (target.checked) ? true: false;
    }

    if(name === 'performanceMode')
    {
      if(value === 'Default'){
        item.performanceMode = 'Default';
      }
      else
      {
        item.performanceMode = 'MaxIo';
      }
    }
    if(name === 'throughputMode')
    {
      if(value === 'Bursting'){
        item.throughputMode = 'Bursting';
      }
      else
      {
        item.throughputMode = 'Provisioned';
      }
    }
    if(name === 'encryptionType')
    {
      if(value === 'Kms'){
        item.encryptionType = 'Kms';
      }
      else
      {
        item.encryptionType = 'KmsExterne';
      }
    }
    
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
      
      item.kmsId = '';
      item.kms = {};
      item.kmsss = [];

      item.subnetgroupId = '';
      item.subnetgroup = {};
      item.subnetgroups = [];
    
    }

    if(name === 'vpcId')
    {
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/type/EFS' +'/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          item.subnetgroups = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (item.accountId) + '/kmss',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.kmss = jsonResult;
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
      performanceMode: true, 
      throughputMode: true, 
      provisionedIo: true, 
      kmsId: true,
      kmsExterne: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.performanceMode, item.throughputMode, item.provisionedIo, item.kmsId, item.kmsExterne, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/efss'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    item.subnetgroup={id: item.subnetgroupId};
    
    //console.log("sma" + item.subnetgroupId);
    if(item.throughputMode === 'Bursting') item.provisionedIo = 0;
    
    if(item.encryption)
    {
      if(item.encryptionType === 'KmsExterne')
      {
        item.kms = null;
      }
      else
      {
        item.kmsExterne = '';
        item.kms = {id: item.kmsId};
      }
    }
    else
    {
      item.kms = null;
      item.kmsExterne = '';
    }


    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/efss/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/efss', {
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

  validate(name, vpcId, subnetgroupId, performanceMode, throughputMode, provisionedIo, kmsId, kmsExterne, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      subnetgroupId: '',
      performanceMode: '', 
      throughputMode: '', 
      provisionedIo: '', 
      kmsId: '',
      kmsExterne: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.touched.subnetgroupId && subnetgroupId.length === 0){
      errors.subnetgroupId = 'Subnet group should not be null';
      return errors;
    }
    else if(this.state.item.touched.performanceMode && performanceMode.length === 0){
      errors.performanceMode = 'performanceMode should not be null';
      return errors;
    }
    else if(this.state.item.touched.throughputMode && throughputMode.length === 0){
      errors.throughputMode = 'throughputMode should not be null';
      return errors;
    }
    else if(this.state.item.throughputMode === 'Provisioned' && this.state.item.touched.provisionedIo && (provisionedIo <= 0 || provisionedIo > 1024)){
      errors.provisionedIo = 'Valid range is 1-1024 MiB/s';
      return errors;
    }
    
    else if(this.state.item.encryption && this.state.item.encryptionType === 'Kms' && this.state.item.touched.kmsId && kmsId.length === 0){
      errors.kmsId = 'kmsId should not be null';
      return errors;
    }
    
    else if(this.state.item.encryption && this.state.item.encryptionType === 'KmsExterne' && this.state.item.touched.kmsExterne && kmsExterne.length === 0){
      errors.kmsExterne = 'kmsExterne should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit efs' : 'Add efs'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.performanceMode, item.throughputMode, item.provisionedIo, item.kmsId, item.kmsExterne, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/efss";

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
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let tri = item.vpcId || '';
    item.vpcId = tri;


    let optss = [];
    if(item.subnetgroups && item.subnetgroups.length){
      item.subnetgroups.map(s => {  
          optss.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let sg = item.subnetgroupId || '';
    item.subnetgroupId = sg;

    let provisionedIo = (item.throughputMode === 'Provisioned') ? <FormGroup>
            <Label for="provisionedIo">Provisioned Io (*)</Label>
            <Input type="number" name="provisionedIo" id="provisionedIo" value={item.provisionedIo || ''} placeholder="Enter provisionedIo"
                   onChange={this.handleChange} onBlur={this.handleBlur('provisionedIo')} autoComplete="provisionedIo"
                   valid={errors.provisionedIo === ''}
                   invalid={errors.provisionedIo !== ''}
            />
           <FormFeedback>{errors.provisionedIo}</FormFeedback>
           <FormText>Valid range is 1-1024 MiB/s</FormText>
          </FormGroup> : '';

    let encryptionType = (item.encryption) ? <FormGroup tag="fieldset">
            <Label for="performanceMode"></Label>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="encryptionType" id="encryptionType" value="Kms" checked={item.encryptionType === 'Kms'}
                       onChange={this.handleChange} onBlur={this.handleBlur('encryptionType')} autoComplete="encryptionType"
                       valid={errors.encryptionType === ''}
                       invalid={errors.encryptionType !== ''}
                />{' '}
                Select KMS master key
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="encryptionType" id="encryptionType" value="KmsExterne" checked={item.encryptionType === 'KmsExterne'}
                       onChange={this.handleChange} onBlur={this.handleBlur('encryptionType')} autoComplete="encryptionType"
                       valid={errors.encryptionType === ''}
                       invalid={errors.encryptionType !== ''}
                />{' '}
                 Enter a KMS key ARN from another account
              </Label>
            </FormGroup>
            <FormFeedback>{errors.encryptionType}</FormFeedback>
          </FormGroup> : '' ;

    let kmsExterne = (item.encryption && item.encryptionType === 'KmsExterne') ? <FormGroup>
            <Label for="name">ARN/ID (*)</Label>
            <Input type="text" name="kmsExterne" id="kmsExterne" value={item.kmsExterne || ''} placeholder="Enter kmsExterne"
                   onChange={this.handleChange} onBlur={this.handleBlur('kmsExterne')} autoComplete="kmsExterne"
                   valid={errors.kmsExterne === ''}
                   invalid={errors.kmsExterne !== ''}
            />
           <FormFeedback>{errors.kmsExterne}</FormFeedback>
          </FormGroup> : '' ;

    let optks = [];
    if(item.kmss && item.kmss.length){
      item.kmss.map(r => {  
          optks.push(<option value={r.id}>{r.id} {r.alias}</option>);
      });
    }
    let kms = item.kmsId || '';
    item.kmsId = kms;

    let kmss = (item.encryption && item.encryptionType === 'Kms') ? <FormGroup>
            <Label for="kmsId">Kms (*)</Label>
            <Input type="select" name="kmsId" id="kmsId"  value={kms} onChange={this.handleChange} onBlur={this.handleBlur('kmsId')}
                 valid={errors.kmsId === ''}
                 invalid={errors.kmsId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optks}
            </Input>
            <FormFeedback>{errors.kmsId}</FormFeedback>
          </FormGroup> : '';

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

          <FormGroup tag="fieldset">
            <Label for="performanceMode">Performance Mode(*)  </Label>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="performanceMode" id="performanceMode" value="Default" checked={item.performanceMode === 'Default'}
                       onChange={this.handleChange} onBlur={this.handleBlur('performanceMode')} autoComplete="performanceMode"
                       valid={errors.performanceMode === ''}
                       invalid={errors.performanceMode !== ''}
                />{' '}
                General Purpose
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="performanceMode" id="performanceMode" value="MaxIo" checked={item.performanceMode === 'MaxIo'}
                       onChange={this.handleChange} onBlur={this.handleBlur('performanceMode')} autoComplete="performanceMode"
                       valid={errors.performanceMode === ''}
                       invalid={errors.performanceMode !== ''}
                />{' '}
                 Max I/O
              </Label>
            </FormGroup>
            <FormFeedback>{errors.performanceMode}</FormFeedback>
          </FormGroup>



          <FormGroup tag="fieldset">
            <Label for="throughputMode">Throughput Mode(*)  </Label> 
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="throughputMode" id="throughputMode" value="Bursting" checked={item.throughputMode === 'Bursting'}
                       onChange={this.handleChange} onBlur={this.handleBlur('throughputMode')} autoComplete="throughputMode"
                       valid={errors.throughputMode === ''}
                       invalid={errors.throughputMode !== ''}
                />{' '}
                Bursting
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="throughputMode" id="throughputMode" value="Provisioned" checked={item.throughputMode === 'Provisioned'}
                       onChange={this.handleChange} onBlur={this.handleBlur('throughputMode')} autoComplete="throughputMode"
                       valid={errors.throughputMode === ''}
                       invalid={errors.throughputMode !== ''}
                />{' '}
                 Provisioned
              </Label>
            </FormGroup>
            <FormFeedback>{errors.throughputMode}</FormFeedback>
          </FormGroup>
          {provisionedIo}

          <FormGroup > 
            <Label for="encryption">Enable encryption of data at rest:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="encryption" id="encryption" 
                    onChange={this.handleChange} onBlur={this.handleBlur('encryption')} 
                    checked={item.encryption === true}/>
          </FormGroup>

          {encryptionType}
          {kmss}
          {kmsExterne}

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

export default withRouter(EfsEdit);