import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class EccEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    autoAssignPublicIp: '', 
    shutdownBehaviour: '', 
    enableTerminationProtection: false, 
    encoded64: false, 
    instanceType: '', 
    amiId: '',
    amis: [],
    monitoring: false, 
    userData: false, 
    userDataText: '',
    instanceTypes: [],
    instanceTypeId: '',
    vpcs: [],
    vpcId : '',
    subnets: [],
    subnetId : '',
    sgss: {},
    sgs: [],
    sgId: [],
    roles: [],
    roleId : '',
    touched: {
      autoAssignPublicIp: false, 
      shutdownBehaviour: false, 
      instanceTypeId: false, 
      amiId: false, 
      userDataText: false,
      vpcId: false,
      subnetId: false,
      sgId: false,
      name: false,
      accountId: false,
      roleId: false
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

      const ecc = await (await fetch(`${API_BASE_URL}/eccs/${this.props.match.params.id}`)).json();
      ecc.touched = {
        autoAssignPublicIp: false, 
        shutdownBehaviour: false, 
        instanceTypeId: false, 
        amiId: false, 
        userDataText: false,
        vpcId: false,
        subnetId: false,
        sgId: false,
        name: false,
        accountId: false,
        roleId: false
      };
      this.setState({item: ecc});

      let item = {...this.state.item};
      item.instanceTypeId = ecc.instanceType.id;
      item.amiId = ecc.ami.id;
      item.vpcId = ecc.vpc.id;
      item.accountId = ecc.account.id;
      item.subnetId = ecc.subnet.id;
      if(ecc.role) item.roleId = ecc.role.id;
      else item.roleId = '';

      await fetch(API_BASE_URL + '/accounts/' + (ecc.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        //let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await (await  fetch(API_BASE_URL + '/regions/' + (ecc.vpc.cidr.region.id) + '/amis',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.amis = jsonResult;
          this.setState({item: item});
        }));
      await (await  fetch(API_BASE_URL + '/vpcs/' + (ecc.vpc.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.subnets = jsonResult;
          this.setState({item: item});
        }));
      await (await  fetch(API_BASE_URL + '/vpcs/' + (ecc.vpc.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
        }));
      await (await  fetch(API_BASE_URL + '/accounts/' + (ecc.account.id) + '/roles',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.roles = jsonResult;
          this.setState({item: item});
        }));
    
      

      var values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;
      this.setState({item: item});
      /*
      */
    }
    else {
      const ecc = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        autoAssignPublicIp: '', 
        shutdownBehaviour: '', 
        enableTerminationProtection: false, 
        encoded64: false, 
        instanceType: '', 
        instanceType:'',
        amiId: '',
        amis: [],
        monitoring: false, 
        userData: false, 
        userDataText: '',
        vpcs: [],
        vpcId : '',
        sgss: {},
        sgs: [],
        sgId: [],
        roles: [],
        roleId : '',
        touched: {
          autoAssignPublicIp: false, 
          shutdownBehaviour: false, 
          instanceTypeId: false, 
          amiId: false, 
          userDataText: false,
          vpcId: false,
          subnetId: false,
          sgId: false,
          name: false,
          accountId: false,
          roleId: false
        }
      };
      ecc.touched = {
          autoAssignPublicIp: false, 
          shutdownBehaviour: false, 
          instanceTypeId: false, 
          amiId: false, 
          userDataText: false,
          vpcId: false,
          subnetId: false,
          sgId: false,
          name: false,
          accountId: false,
          roleId: false
      };
      this.setState({item: ecc});
    }
    
    await fetch(API_BASE_URL + '/instanceTypes',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.instanceTypes = jsonResult;
      this.setState({item: item});
    });

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
    
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name; 
    const value = target.value;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    //enableTerminationProtection monitoring userData encoded64
    if(name === 'enableTerminationProtection')
    {
      item.enableTerminationProtection = (target.checked) ? true: false;
    }
    else if(name === 'monitoring')
    {
      item.monitoring = (target.checked) ? true: false;
    } else if(name === 'userData')
    {
      item.userData = (target.checked) ? true: false;
    }else if(name === 'encoded64')
    {
      item.encoded64 = (target.checked) ? true: false;
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

      item.amis = [];
      item.amiId = '';
      item.ami = {};

      item.subnetId = '';
      item.subnets = [];
      item.subnet = {};
      
      item.roleId = '';
      item.roles = [];
      item.role = {};

      item.sgId = '';
      item.sgs = [];
      item.sgss = [];
    }
    else if(name === 'vpcId')
    {
      let vp={};
      fetch(API_BASE_URL + "/vpcs/" + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch(API_BASE_URL + '/regions/' + (vp.cidr.region.id) + '/amis',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.amis = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/vpcs/' + (vp.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnets = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/vpcs/' + (vp.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (vp.account.id) + '/roles',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.roles = jsonResult;
          this.setState({item: item});
        });
      });
     
    }
  }


  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
      autoAssignPublicIp: true, 
      shutdownBehaviour: true, 
      instanceTypeId: true, 
      amiId: true, 
      userDataText: true,
      vpcId: true,
      subnetId: true,
      sgId: true,
      name: true,
      accountId: true,
      roleId: true
    };
    const errors = this.validate(item.name, item.autoAssignPublicIp, item.shutdownBehaviour, item.instanceTypeId, item.amiId, item.userDataText, 
      item.userData, item.vpcId, item.subnetId, item.sgId, item.roleId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/eccs'; 

    if(!item.userData) {
      item.userDataText = '';
      item.encoded64 = false;
    }
    item.instanceType = {id: item.instanceTypeId};
    item.ami = {id: item.amiId};
    item.vpc = {id: item.vpcId};
    item.account = {id: item.accountId};
    item.subnet = {id: item.subnetId};

    
    if(item.roleId !== "") item.role = {id: item.roleId};
    else {
      item.role = null;

    }
    var values = [];
    if(item.sgs && item.sgs.length){
      item.sgs.map(s => { 
        values.push({"id": s.id});
        console.log('item.sg=' + s.id);
      });
      item.sg= values;
    }
    
    await fetch((item.id) ? API_BASE_URL + '/eccs/'+(item.id) : API_BASE_URL + '/ecc', {
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

  validate(name, autoAssignPublicIp, shutdownBehaviour, instanceTypeId, amiId, userDataText, userData, vpcId, subnetId, sgId, roleId, accountId) {

    const errors = {
      autoAssignPublicIp: '', 
      shutdownBehaviour: '', 
      instanceTypeId: '', 
      amiId: '', 
      userDataText: '',
      vpcId : '',
      subnetId: '',
      sgId: '', 
      name:'',
      accountId: '',
      roleId: ''
    };

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'name type should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId type should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'vpc type should not be null';
      return errors;
    }
    else if(this.state.item.touched.subnetId && (!subnetId || subnetId.length === 0)){
      errors.subnetId = 'subnet type should not be null';
      return errors;
    }
    else if(this.state.item.touched.amiId && amiId.length === 0){
      errors.amiId = 'ami type should not be null';
      return errors;
    }
    if(this.state.item.touched.instanceTypeId && instanceTypeId.length === 0){
      errors.instanceTypeId = 'instanceType should not be null';
      return errors;
    }
    else if(this.state.item.touched.autoAssignPublicIp && autoAssignPublicIp.length === 0){
      errors.autoAssignPublicIp = 'autoAssignPublicIp should not be null';
      return errors;
    }
    else if(this.state.item.touched.shutdownBehaviour && shutdownBehaviour.length === 0){
      errors.shutdownBehaviour = 'shutdownBehaviour should not be null';
      return errors;
    }
    else if(userData && this.state.item.touched.userDataText && userDataText.length === 0){
      errors.userDataText = 'userDataText type should not be null';
      return errors;
    }
    /*else if(this.state.item.touched.roleId && roleId.length === 0){
      errors.roleId = 'roleId should not be null';
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
    const title = <h2>{item.id ? 'Edit Ecc' : 'Add Ecc'}</h2>;

    const errors = this.validate(item.name, item.autoAssignPublicIp, item.shutdownBehaviour, item.instanceTypeId, item.amiId, 
      item.userDataText, item.userData, item.vpcId, item.subnetId, item.sgId, item.roleId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/eccs";

    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let isUsed = false;
    if(item.id !== '' && (item.targets && item.targets.length !== 0) ) isUsed = true;

    const encoded64 = (item.userData) ? <FormGroup >
            <Label for="encoded64" >Encoded64:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="encoded64" id="encoded64" disabled = {isUsed}
                    onChange={this.handleChange} onBlur={this.handleBlur('encoded64')} 
                    checked={item.encoded64 === true}/>
          </FormGroup> : '';
    const userDataText = (item.userData) ? <FormGroup>
            <Label for="userDataText">User Data Text(*)</Label>
            <Input type="textarea" name="userDataText" id="userDataText" value={item.userDataText || ''} placeholder="Enter userDataText" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('userDataText')} autoComplete="userDataText"
                   valid={errors.userDataText === ''}
                   invalid={errors.userDataText !== ''}
            />
           <FormFeedback>{errors.userDataText}</FormFeedback>
          </FormGroup> : '';
          
    let optVpcs = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          optVpcs.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    
    let optAmis = [];
    if(item.amis && item.amis.length){
      item.amis.map(s => {  
          optAmis.push(<option key={s.id} value={s.id}>{s.id} {s.name} {s.amiId}</option>);
      });
    }
    let ami = item.amiId || '';
    item.amiId = ami;

    let optInstanceTypes = [];
    if(item.instanceTypes && item.instanceTypes.length){
      item.instanceTypes.map(s => {  
          optInstanceTypes.push(<option key={s.id} value={s.id}>{s.id} {s.type}</option>);
      });
    }
    let instanceType = item.instanceTypeId || '';
    item.instanceTypeId = instanceType;

    let optSubnets = [];
    if(item.subnets && item.subnets.length){
      item.subnets.map(s => {  
          optSubnets.push(<option key={s.id} value={s.id}>{s.id} {s.name} </option>);
      });
    }
    let sub = item.subnetId || '';
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
    const securityGroup = <FormGroup>
            <Label for="sgId">Security Group (*)</Label>
            <Select name="sgId" id="sgId"  placeholder="Enter Security group" isMulti disabled = {isUsed}
              value={optsgs}
              onChange={e => this.onOptionChange("sgId",e)}
              onBlur={this.handleBlur('sgId')}
              options={optsg}

            />
            <FormFeedback>{errors.sgId}</FormFeedback>
          </FormGroup>;

    let optRoles = [];
    if(item.roles && item.roles.length){
      item.roles.map(s => {  
          optRoles.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let role = item.RoleId || '';
    item.RoleId = role;


    return <div>
      <AppNavbar/>
      <Container>
        {title}
         <Form onSubmit={this.handleSubmit}>
      
         <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''} >
            </Input>
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="accountId">Account (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')} disabled = {isUsed}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optas}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vpcId">Vpc (*)</Label>
            <Input type="select" name="vpcId" id="vpcId" value={item.vpcId || ''} placeholder="Enter vpc" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} autoComplete="vpcId"
                   valid={errors.vpcId === ''}
                   invalid={errors.vpcId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optVpcs}
            </Input>
           <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="subnetId">Subnet (*)</Label>
            <Input type="select" name="subnetId" id="subnetId" value={item.subnetId || ''} placeholder="Enter subnet" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('subnetId')} autoComplete="subnetId"
                   valid={errors.subnetId === ''}
                   invalid={errors.subnetId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optSubnets}
            </Input>
           <FormFeedback>{errors.subnetId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="amiId">Ami(*)</Label>
            <Input type="select" name="amiId" id="amiId" value={item.amiId || ''} placeholder="Enter amiId" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('amiId')} autoComplete="amiId"
                   valid={errors.amiId === ''}
                   invalid={errors.amiId !== ''}>
                   <option value="" disabled>Choose</option>
                   {optAmis}
            </Input>
           <FormFeedback>{errors.amiId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="instanceTypeId">Instance Type (*)</Label>
            <Input type="select" name="instanceTypeId" id="instanceTypeId" value={item.instanceTypeId || ''} placeholder="Enter instanceType" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceTypeId')} autoComplete="instanceTypeId"
                   valid={errors.instanceTypeId === ''}
                   invalid={errors.instanceTypeId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optInstanceTypes}
            </Input>
           <FormFeedback>{errors.instanceTypeId}</FormFeedback>
          </FormGroup>
          
          {securityGroup}

          <FormGroup>
            <Label for="autoAssignPublicIp">Auto Assign Public Ip (*)</Label>
            <Input type="select" name="autoAssignPublicIp" id="autoAssignPublicIp" value={item.autoAssignPublicIp || ''} disabled = {isUsed}
                 onChange={this.handleChange} onBlur={this.handleBlur('autoAssignPublicIp')} 
                 valid={errors.autoAssignPublicIp === ''}
                 invalid={errors.autoAssignPublicIp !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Disable">Disable</option>
              <option value="Enable">Enable</option>
            </Input>
            <FormFeedback>{errors.autoAssignPublicIp}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="shutdownBehaviour">Shutdown Behaviour (*)</Label>
            <Input type="select" name="shutdownBehaviour" id="shutdownBehaviour" value={item.shutdownBehaviour || ''} disabled = {isUsed}
                 onChange={this.handleChange} onBlur={this.handleBlur('shutdownBehaviour')} 
                 valid={errors.shutdownBehaviour === ''}
                 invalid={errors.shutdownBehaviour !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Stop">Stop</option>
              <option value="Terminate">Terminate</option>
            </Input>
            <FormFeedback>{errors.shutdownBehaviour}</FormFeedback>
          </FormGroup>

          <FormGroup >
            <Label for="enableTerminationProtection" >Enable Termination Protection:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="enableTerminationProtection" id="enableTerminationProtection" disabled = {isUsed}
                    onChange={this.handleChange} onBlur={this.handleBlur('enableTerminationProtection')} 
                    checked={item.enableTerminationProtection === true}/>
          </FormGroup>

          <FormGroup > 
            <Label for="monitoring" >Monitoring:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="monitoring" id="monitoring" disabled = {isUsed}
                    onChange={this.handleChange} onBlur={this.handleBlur('monitoring')} 
                    checked={item.monitoring === true}/>
          </FormGroup>

          <FormGroup >
            <Label for="userData" >User Data:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="userData" id="userData" disabled = {isUsed}
                    onChange={this.handleChange} onBlur={this.handleBlur('userData')} 
                    checked={item.userData === true}/>
          </FormGroup>

          {encoded64}
          {userDataText}

          <FormGroup>
            <Label for="roleId">Role (*)</Label>
            <Input type="select" name="roleId" id="roleId" value={item.roleId || ''} placeholder="Enter roleId" disabled = {isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('roleId')} autoComplete="roleId"
                   valid={errors.roleId === ''}
                   invalid={errors.roleId !== ''} >
                   <option value="" >Choose</option>
                   {optRoles}
            </Input>
           <FormFeedback>{errors.roleId}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled || isUsed}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(EccEdit);