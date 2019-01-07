import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class LbEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
    account: {},
    accounts: {},
    accountId : '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    type : '',
    ipType: '',
    scheme: true,
    subnetss: {},
    subnets: [],
    subnetId: [],
    sgss: {},
    sgs: [],
    sgId: [],
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      type : false,
      ipType: false,
      subnetId: false,
      sgId: false
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

      const lb = await (await fetch(`${API_BASE_URL}/lbs/${this.props.match.params.id}`)).json();
      lb.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        type : false,
        ipType: false,
        subnetId: false,
        sgId: false
      };
      this.setState({item: lb});
      
      let vp={};
      
      await fetch(API_BASE_URL + '/accounts/' + (lb.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await (await fetch(API_BASE_URL + '/vpcs/' + (lb.vpc.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetss = jsonResult;
          this.setState({item: item});
        }));
      
        await (await fetch(API_BASE_URL + '/vpcs/' + (lb.vpc.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
        }));
      

      let item = {...this.state.item};
      item.vpcId = lb.vpc.id;
      item.accountId = lb.account.id;
      var values = [];
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });
      item.subnets = values;

      values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;
      this.setState({item: item});
      
    }
    else {
      const lb = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        type : '',
        ipType: '',
        scheme: true,
        subnetss: {},
        subnets: [],
        subnetId: [],
        sgss: {},
        sgs: [],
        sgId: [],
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          type : false,
          ipType: false,
          subnetId: false,
          sgId: false
        }
      };
      lb.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          type : false,
          ipType: false,
          subnetId: false,
          sgId: false
      };
      this.setState({item: lb});
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
    const name = target.name; 
    const value = target.value;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'accessType')
    {
      if(value === 'internal'){
        item.scheme = true;
      }
      else
      {
        item.scheme = false;
      }
    }
    else if(name === 'deletionProtection')
    {
      item.deletionProtection = (target.checked) ? true: false;
    }
    else if(name === 'crossZoneLoadBalancing')
    {
      item.crossZoneLoadBalancing = (target.checked) ? true: false;
    }
    else if(name === 'http2')
    {
      item.http2 = (target.checked) ? true: false;
    }
    else if(name === 'accessLogs')
    {
      item.accessLogs = (target.checked) ? true: false;
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
      item.sgsId = '';
      item.sgs = [];
      item.sgss = [];
      
      item.subnetId = '';
      item.subnets = [];
      item.subnetss = [];
      
      
    }

    else if(name === 'vpcId')
    {
      let vp={};
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.subnetss = jsonResult;
          this.setState({item: item});
        });
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.sgss = jsonResult;
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
          type : true,
          ipType: true,
          subnetId: true,
          sgId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.type, item.scheme, item.ipType, item.subnetId, item.subnets, item.sgId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/lbs'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};

    if(item.scheme) 
    {
      item.ipType='ipv4';
    }
    if(item.type !== 'ALB'){
      item.sgs = [];
    }
    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/lbs/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/lbs', {
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

  validate(name, vpcId, type, scheme, ipType, subnetId, subnets, sgId, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      type: '',
      ipType: '',
      subnetId: '',
      sgId: ''
    };
    
    //if(subnetId) console.log("subnets.length=" + subnets.length);

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }
    else if(!scheme && this.state.item.touched.ipType && ipType.length === 0){
      errors.ipType = 'Ip type should not be null';
      return errors;
    }
    else if(this.state.item.touched.subnetId && subnetId && type === 'ALB' && subnets.length <= 1){
      //alert('tttttt');
      errors.subnetId = 'Add subnets to cover at least 2 availability zones.';
      return errors;
    }
    else if(this.state.item.touched.subnetId && subnetId && type === 'NLB' && subnets.length <= 0){
      errors.subnetId = 'Add subnets to cover at least 1 availability zones.';
      return errors;
    }
    else if(this.state.item.touched.subnetId && subnetId && type === 'ELB' && subnets.length <= 0){
      errors.subnetId = 'Add subnets to cover at least 1 availability zones.';
      return errors;
    }
    
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
      else if(selectName === 'subnetId')
      {
        for (var i = 0, l = options.length; i < l; i++) {
          if(item.subnetss && item.subnetss.length){
              item.subnetss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.subnets = values;
      }
      this.setState({item});
  };

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Target Group' : 'Add Target Group'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.type, item.scheme, item.ipType, item.subnetId, item.subnets, item.sgId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/lbs";

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
    let vpc = item.vpcId || '';
    item.vpcId = vpc;

    let isInternal = item.scheme;
    
    let iptype = (!item.scheme && item.type === 'ALB') ? <FormGroup>
            <Label for="ipType">IP address type (*)</Label>
            <Input type="select" name="ipType" id="ipType"  value={item.ipType || ''} onChange={this.handleChange} onBlur={this.handleBlur('ipType')}
                 valid={errors.ipType === ''}
                 invalid={errors.ipType !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="ipv4" >ipv4</option>
              <option value="ipv6" >dualstack</option>
            </Input>
            <FormFeedback>{errors.ipType}</FormFeedback>
          </FormGroup> : <FormGroup>
            <Label for="ipType">IP address type (*)</Label>
            <Input type="select" name="ipType" id="ipType"  value={item.ipType || ''} onChange={this.handleChange} onBlur={this.handleBlur('ipType')} disabled="true"
                 valid={errors.ipType === ''}
                 invalid={errors.ipType !== ''}
            >
              <option value="ipv4" >ipv4</option>
            </Input>
            <FormFeedback>{errors.ipType}</FormFeedback>
          </FormGroup>;
    
    const connectionDraining = (item.type === 'ELB') ? <FormGroup>
            <Label for="connectionDraining">Connection Draining</Label>
            <Input type="number" name="connectionDraining" id="connectionDraining" value={item.connectionDraining || ''} placeholder="Enter connectionDraining"
                   onChange={this.handleChange} onBlur={this.handleBlur('connectionDraining')} autoComplete="connectionDraining"
            />
          </FormGroup> : '';
    
    const crossZoneLoadBalancing = (item.type !== 'ALB') ? <FormGroup check>
            <Label for="crossZoneLoadBalancing" check>Cross-Zone Load Balancing:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="crossZoneLoadBalancing" id="crossZoneLoadBalancing" onChange={this.handleChange} onBlur={this.handleBlur('crossZoneLoadBalancing')} 
                    checked={item.crossZoneLoadBalancing === true}/>
          </FormGroup> : '';
    
    const idleTimeout = (item.type !== 'NLB') ? <FormGroup>
            <Label for="idleTimeout">Idle timeout</Label>
            <Input type="number" name="idleTimeout" id="idleTimeout" value={item.idleTimeout || ''} placeholder="Enter idleTimeout"
                   onChange={this.handleChange} onBlur={this.handleBlur('idleTimeout')} autoComplete="idleTimeout"
            />
          </FormGroup> : '';
    const http2 = (item.type === 'ALB') ? <FormGroup check>
            <Label for="http2" check>HTTP/2:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="http2" id="http2" onChange={this.handleChange} onBlur={this.handleBlur('http2')} 
                    checked={item.http2 === true}/>
          </FormGroup> : '';
    const accessLogs = (item.type !== 'NLB') ? <FormGroup check>
            <Label for="accessLogs" check>Access logs:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="accessLogs" id="accessLogs" onChange={this.handleChange} onBlur={this.handleBlur('accessLogs')} 
                    checked={item.accessLogs === true}/>
          </FormGroup> : '';

    let optss = [];
    let optsss = [];
    if(item.subnetss && item.subnetss.length){
      item.subnetss.map(s => {
      
          if(item.subnets && item.subnets.length) item.subnets.map(ss => {
             if(s.id == ss.id) optsss.push({value: s.id, label: s.name + "   " + s.az.name});
          });
          optss.push({value: s.id, label: s.name + "   " + s.az.name});
      });
    }
    const subnets = <FormGroup>
            <Label for="subnetId">Subnets (*)</Label>

            <Select name="subnetId" id="subnetId"  placeholder="Enter Subnet" isMulti isSearchable 
              value={optsss}
              onChange={e => this.onOptionChange("subnetId",e)}
              onBlur={this.handleBlur('subnetId')}
              options={optss}/>
              <FormFeedback>{errors.subnetId}</FormFeedback>
          </FormGroup>
          ;
    let sub = item.subnetId || {};
    item.subnetId = sub;

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
    const securityGroup = (item.type === 'ALB') ? <FormGroup>
            <Label for="sgId">Security Group (*)</Label>
            <Select name="sgId" id="sgId"  placeholder="Enter Security group" isMulti 
              value={optsgs}
              onChange={e => this.onOptionChange("sgId",e)}
              onBlur={this.handleBlur('sgId')}
              options={optsg}

            />
            <FormFeedback>{errors.sgId}</FormFeedback>
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
            <Label for="type">Target type (*)</Label>
            <Input type="select" name="type" id="type" value={item.type || ''} onChange={this.handleChange} onBlur={this.handleBlur('type')} 
                 valid={errors.type === ''}
                 invalid={errors.type !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="ALB">ALB</option>
              <option value="NLB">NLB</option>
              <option value="ELB">ELB (deprecated)</option>
            </Input>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>
          
          <FormGroup tag="fieldset">
            <Label for="accessType">Scheme(*)</Label>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="internet" checked={isInternal === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                internet-facing
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="internal" checked={isInternal === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                 internal
              </Label>
            </FormGroup>
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>

          {iptype}
          
          <FormGroup>
            <Label for="vpcId">Vpcs (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          {subnets}
      
          {securityGroup}

          <FormGroup check>
            <Label for="deletionProtection" check>Deletion Protection:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="deletionProtection" id="deletionProtection" onChange={this.handleChange} onBlur={this.handleBlur('deletionProtection')} 
                    checked={item.deletionProtection === true}/>
          </FormGroup>
          
          {crossZoneLoadBalancing}
          {http2}
          {accessLogs}
          {idleTimeout}
          {connectionDraining}

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

export default withRouter(LbEdit);