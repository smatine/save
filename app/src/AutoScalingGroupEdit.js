import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AutoScalingGroupEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    launchConfiguration: {},
    launchConfigurations: {},  
    launchConfigurationId: '',
    groupSize: '', 
    loadBalancing: false, 
    targetGroups: [], 
    targetGroupss: [],
    targetGroupId: [],
    healthCheckType: 'EC2', 
    healthCheckGracePeriod: '', 
    instanceProtection: '', 
    serviceLinkedRole: '', 
    createAutoScalingGroup: true,
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    subnets: [],
    subnetss: [],
    subnetId: [],
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      subnetId: false,
      launchConfigurationId: false,  
      groupSize: false, 
      targetGroupId: false, 
      healthCheckGracePeriod: false, 
      instanceProtection: false, 
      serviceLinkedRole: false
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

      const autoScalingGroup = await (await fetch(`${API_BASE_URL}/autoScalingGroups/${this.props.match.params.id}`)).json();
      autoScalingGroup.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        subnetId: false,
        launchConfigurationId: false,  
        groupSize: false, 
        targetGroupId: false, 
        healthCheckGracePeriod: false, 
        instanceProtection: false, 
        serviceLinkedRole: false
      };
      this.setState({item: autoScalingGroup});


      await fetch(API_BASE_URL + '/accounts/' + (autoScalingGroup.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await (await fetch(API_BASE_URL + '/vpcs/' + (autoScalingGroup.vpc.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetss = jsonResult;
          this.setState({item: item});
        }));
      await (await fetch(API_BASE_URL + '/vpcs/' + (autoScalingGroup.vpc.id) + '/launchConfigurations',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.launchConfigurations = jsonResult;
          this.setState({item: item});
        }));
      await (await fetch(API_BASE_URL + '/vpcs/' + (autoScalingGroup.vpc.id) + '/targetGroups',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.targetGroupss = jsonResult;
          this.setState({item: item});
        }));
      
      
      let item = {...this.state.item};
      item.vpcId = autoScalingGroup.vpc.id;
      item.accountId = autoScalingGroup.account.id;
      item.launchConfigurationId = autoScalingGroup.launchConfiguration.id;
      var values = [];
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });
      item.subnets = values;
      values = [];
      item.targetGroups.map(t => { 
        values.push({"id": t.id});
      });
      item.targetGroups = values;
      this.setState({item: item});
      
    }
    else {
      const autoScalingGroup = {
        name: '',
        accountId: false,
        account: {},
        accounts: {},
        accountId : '',
        launchConfiguration: {},
        launchConfigurations: {},  
        launchConfigurationId: '',
        groupSize: '', 
        loadBalancing: false, 
        targetGroups: [], 
        targetGroupss: [],
        targetGroupId: [],
        healthCheckType: 'EC2', 
        healthCheckGracePeriod: '', 
        instanceProtection: '', 
        serviceLinkedRole: '', 
        createAutoScalingGroup: true,
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnets: [],
        subnetss: [],
        subnetId: [],
        touched: {
          name: false,
          vpcId: false,
          subnetId: false,
          launchConfigurationId: false,  
          groupSize: false, 
          targetGroupId: false, 
          healthCheckGracePeriod: false, 
          instanceProtection: false, 
          serviceLinkedRole: false
        }
      };
      autoScalingGroup.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          subnetId: false,
          launchConfigurationId: false,  
          groupSize: false, 
          targetGroupId: false, 
          healthCheckGracePeriod: false, 
          instanceProtection: false, 
          serviceLinkedRole: false
      };
      this.setState({item: autoScalingGroup});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });
    /*
    await fetch('/vpcs',)
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
    

    if(name === 'typecreateAutoScalingGroup')
    {
      if(value === 'Keep'){
        item.createAutoScalingGroup = true;
      }
      else
      {
        item.createAutoScalingGroup = false;
      }
    }

    if(name === 'type')
    {
      if(value === 'ELB'){
        item.healthCheckType = 'ELB';
      }
      else
      {
        item.healthCheckType = 'EC2';
      }
    }

    if(name === 'loadBalancing')
    {
      item.loadBalancing = (target.checked) ? true: false;
      if(item.healthCheckType === '') item.healthCheckType = 'EC2';
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

      item.subnetId = '';
      item.subnets = [];
      item.subnetss = [];

      item.launchConfigurationId = '';
      item.launchConfiguration = {};
      item.launchConfigurations = [];

      item.targetGroupId = '';
      item.targetGroups = [];
      item.targetGroupss = [];
      

    }
    if(name === 'vpcId')
    {
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetss = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/launchConfigurations',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.launchConfigurations = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/targetGroups',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.targetGroupss = jsonResult;
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
      subnetId: true,
      launchConfigurationId: true,  
      groupSize: true, 
      targetGroupId: true, 
      healthCheckGracePeriod: true, 
      instanceProtection: true, 
      serviceLinkedRole: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.launchConfigurationId, item.groupSize, item.targetGroupId, 
      item.healthCheckGracePeriod, item.instanceProtection, item.serviceLinkedRole, item.accountId);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/autoScalingGroups'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    item.launchConfiguration={id: item.launchConfigurationId};
    if(!item.loadBalancing)
    {
      item.targetGroups = [];
      item.healthCheckType = '';

    }
    //console.log("groupSize=" + item.groupSize);
    //console.log("");
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/autoScalingGroups/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/autoScalingGroups', {
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

  validate(name, vpcId, subnetId, launchConfigurationId, groupSize, targetGroupId, 
      healthCheckGracePeriod, instanceProtection, serviceLinkedRole, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      subnetId: '',
      launchConfigurationId: '',  
      groupSize: '', 
      targetGroupId: '', 
      healthCheckGracePeriod: '', 
      instanceProtection: '', 
      serviceLinkedRole: ''
    };
    //console.log('this.state.item.subnets.length=' + this.state.item.subnets.length);

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
    
    if(this.state.item.touched.launchConfigurationId && launchConfigurationId.length === 0){
      errors.launchConfigurationId = 'launchConfigurationId should not be null';
      return errors;
    } 

    if(this.state.item.touched.subnetId  && this.state.item.subnets.length === 0){
      errors.subnetId = 'Add subnets.';
      return errors;
    }

    if(this.state.item.touched.groupSize && groupSize.length === 0){
      errors.groupSize = 'groupSize should not be null';
      return errors;
    }
    
    if(this.state.item.loadBalancing && this.state.item.touched.targetGroupId  && this.state.item.targetGroups.length === 0){
      errors.targetGroupId = 'targetGroupId should not be null';
      return errors;
    }
    if(this.state.item.touched.healthCheckGracePeriod && healthCheckGracePeriod.length === 0){
      errors.healthCheckGracePeriod = 'healthCheckGracePeriod should not be null';
      return errors;
    }
    if(this.state.item.touched.instanceProtection && instanceProtection.length === 0){
      errors.instanceProtection = 'instanceProtection should not be null';
      return errors;
    }
    if(this.state.item.touched.serviceLinkedRole && serviceLinkedRole.length === 0){
      errors.serviceLinkedRole = 'serviceLinkedRole should not be null';
      return errors;
    }
    return errors;
  }

  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'targetGroupId') 
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.targetGroupss && item.targetGroupss.length){
              item.targetGroupss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.targetGroups = values;
      }
      if(selectName === 'subnetId') 
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
    const title = <h2>{item.id ? 'Edit Auto Scaling Group' : 'Add Auto Scaling Group'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.launchConfigurationId, item.groupSize, item.targetGroupId, 
      item.healthCheckGracePeriod, item.instanceProtection, item.serviceLinkedRole, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/autoscalinggroups";

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

    let optls = [];
    if(item.launchConfigurations && item.launchConfigurations.length){
      item.launchConfigurations.map(s => {  
          optls.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let launchConfiguration = item.launchConfigurationId || '';
    item.launchConfigurationId = launchConfiguration;
    
    let optsub = [];  
    let optsubs = [];
    if(item.subnetss && item.subnetss.length){
      item.subnetss.map(s => {  
          if(item.subnets && item.subnets.length) item.subnets.map(ss => {
             if(s.id == ss.id) {
               optsub.push({value: s.id, label: s.name});
             }
          });
          optsubs.push({value: s.id, label: s.name});
      });
    }

    let optst = [];  
    let optsts = [];
    if(item.targetGroupss && item.targetGroupss.length){
      item.targetGroupss.map(s => {  
          if(item.targetGroups && item.targetGroups.length) item.targetGroups.map(ss => {
             if(s.id == ss.id) {
               optst.push({value: s.id, label: s.name});
             }
          });
          optsts.push({value: s.id, label: s.name});
      });
    }
    const healthCheckType = item.healthCheckType;
    const createAutoScalingGroup = item.createAutoScalingGroup;
    const targetGroup = (item.loadBalancing === true) ? <FormGroup>
            <Label for="targetGroupId">Target Group (*)</Label>
            <Select name="targetGroupId" id="targetGroupId"  placeholder="Enter targetGroup" isMulti 
              value={optst}
              onChange={e => this.onOptionChange("targetGroupId",e)}
              onBlur={this.handleBlur('targetGroupId')}
              options={optsts}

            />
            <FormFeedback>{errors.targetGroupId}</FormFeedback>
          </FormGroup> : ''
    const type = (item.loadBalancing === true) ? <FormGroup tag="fieldset">
            <Label for="type">Health Check Type (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="type" id="type" value="ELB" checked={healthCheckType === 'ELB'}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type" disabled = 'true'
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                ELB
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="type" id="type" value="EC2" checked={healthCheckType === 'EC2'}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type" disabled = 'true'
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                EC2
              </Label>
            </FormGroup>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup> : ''
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
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="launchConfigurationId">Launch Configuration (*)</Label>
            <Input type="select" name="launchConfigurationId" id="launchConfigurationId"  value={launchConfiguration} onChange={this.handleChange} onBlur={this.handleBlur('launchConfigurationId')}
                 valid={errors.launchConfigurationId === ''}
                 invalid={errors.launchConfigurationId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optls}
            </Input>
            <FormFeedback>{errors.launchConfigurationId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="subnetId">Subnets (*)</Label>
            <Select name="subnetId" id="subnetId"  placeholder="Enter subnet" isMulti 
              value={optsub}
              onChange={e => this.onOptionChange("subnetId",e)}
              onBlur={this.handleBlur('subnetId')}
              options={optsubs}

            />
            <FormFeedback>{errors.subnetId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="groupSize">Group Size (*)</Label>
            <Input type="number" name="groupSize" id="groupSize" value={item.groupSize || ''} placeholder="Enter groupSize"
                   onChange={this.handleChange} onBlur={this.handleBlur('groupSize')} autoComplete="groupSize"
                   valid={errors.groupSize === ''}
                   invalid={errors.groupSize !== ''}
            />
           <FormFeedback>{errors.groupSize}</FormFeedback>
          </FormGroup>

          
          <FormGroup > 
            <Label for="loadBalancing">Load Balancing:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="loadBalancing" id="loadBalancing" 
                    onChange={this.handleChange} onBlur={this.handleBlur('loadBalancing')} 
                    checked={item.loadBalancing === true}/>
          </FormGroup>
          
          {targetGroup}
          {type}
         
          <FormGroup>
            <Label for="healthCheckGracePeriod">Health Check Grace Period (*)</Label>
            <Input type="number" name="healthCheckGracePeriod" id="healthCheckGracePeriod" value={item.healthCheckGracePeriod || ''} placeholder="Enter healthCheckGracePeriod"
                   onChange={this.handleChange} onBlur={this.handleBlur('healthCheckGracePeriod')} autoComplete="healthCheckGracePeriod"
                   valid={errors.healthCheckGracePeriod === ''}
                   invalid={errors.healthCheckGracePeriod !== ''}
            />
           <FormFeedback>{errors.healthCheckGracePeriod}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="instanceProtection">Instance Protection (*)</Label>
            <Input type="text" name="instanceProtection" id="instanceProtection" value={item.instanceProtection || ''} placeholder="Enter instanceProtection"
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceProtection')} autoComplete="instanceProtection"
                   valid={errors.instanceProtection === ''}
                   invalid={errors.instanceProtection !== ''}
            />
           <FormFeedback>{errors.instanceProtection}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="serviceLinkedRole">Service Linked Role (*)</Label>
            <Input type="text" name="serviceLinkedRole" id="serviceLinkedRole" value={item.serviceLinkedRole || ''} placeholder="Enter serviceLinkedRole"
                   onChange={this.handleChange} onBlur={this.handleBlur('serviceLinkedRole')} autoComplete="serviceLinkedRole"
                   valid={errors.serviceLinkedRole === ''}
                   invalid={errors.serviceLinkedRole !== ''}
            />
           <FormFeedback>{errors.serviceLinkedRole}</FormFeedback>
          </FormGroup>

     
          
          <FormGroup tag="fieldset">
            <Label for="typecreateAutoScalingGroup">Create Auto Scaling Group (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="typecreateAutoScalingGroup" id="typecreateAutoScalingGroup" value="Keep" checked={createAutoScalingGroup === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('typecreateAutoScalingGroup')} autoComplete="typecreateAutoScalingGroup"
                       valid={errors.typecreateAutoScalingGroup === ''}
                       invalid={errors.typecreateAutoScalingGroup !== ''}
                />{' '}
                Keep this group at its initial size
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="typecreateAutoScalingGroup" id="type" value="NKeep" checked={createAutoScalingGroup === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('typecreateAutoScalingGroup')} autoComplete="typecreateAutoScalingGroup"
                       valid={errors.typecreateAutoScalingGroup === ''}
                       invalid={errors.typecreateAutoScalingGroup !== ''}
                />{' '}
                Use scaling policies to adjust the capacity of this group
              </Label>
            </FormGroup>
            
            <FormFeedback>{errors.typecreateAutoScalingGroup}</FormFeedback>
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

export default withRouter(AutoScalingGroupEdit);