import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class LaunchConfigurationEdit extends Component {

//name, kernalId, ramDiskId, purchasingOption, iamRole, ipAddressType,
//monitoring, userData, encoded64, userDataText

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    kernalId: '', 
    ramDiskId: '', 
    purchasingOption: false, 
    iamRole: '',
    ipAddressType: '',
    monitoring: false,
    encoded64: false, 
    instanceType: '', 
    instanceTypes: [],
    instanceTypeId: '',
    amiId: '',
    amis: [], 
    userData: false, 
    userDataText: '',
    sgss: {},
    sgs: [],
    sgId: [],
    vpcs: [],
    vpcId : '',
    touched: {
      name: false,
      accountId: false, 
      kernalId: false, 
      ramDiskId: false, 
      iamRole: false, 
      ipAddressType: false,
      instanceTypeId: false,
      amiId: false,
      userDataText: false,
      sgId: false,
      vpcId: false
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

      const launchConfiguration = await (await fetch(`${API_BASE_URL}/launchConfigurations/${this.props.match.params.id}`)).json();
      launchConfiguration.touched = {
        name: false, 
        accountId: false,
        kernalId: false, 
        ramDiskId: false, 
        iamRole: false, 
        ipAddressType: false,
        instanceTypeId: false,
        amiId: false,
        userDataText: false,
        sgId: false,
        vpcId: false
      };
      this.setState({item: launchConfiguration});

      await fetch(API_BASE_URL + '/accounts/' + (launchConfiguration.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await  fetch(API_BASE_URL + '/regions/' + (launchConfiguration.vpc.cidr.region.id) + '/amis',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.amis = jsonResult;
          this.setState({item: item});
      });
        
      await  fetch(API_BASE_URL + '/vpcs/' + (launchConfiguration.vpc.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
      });
      
      let item = {...this.state.item};
      item.instanceTypeId = launchConfiguration.instanceType.id;
      item.amiId = launchConfiguration.ami.id;
      item.vpcId = launchConfiguration.vpc.id;
      item.accountId = launchConfiguration.account.id;

      var values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;
      this.setState({item: item});
      
    }
    else {
      const launchConfiguration = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        kernalId: '', 
        ramDiskId: '', 
        purchasingOption: false, 
        iamRole: '',
        ipAddressType: '',
        monitoring: false,
        encoded64: false, 
        instanceType: '', 
        instanceTypes: [],
        instanceTypeId: '',
        amiId: '',
        amis: [], 
        userData: false, 
        userDataText: '',
        sgss: {},
        sgs: [],
        sgId: [],
        vpcs: [],
        vpcId : '',
        touched: {
          name: false, 
          accountId: false,
          kernalId: false, 
          ramDiskId: false, 
          iamRole: false, 
          ipAddressType: false,
          instanceTypeId: false,
          amiId: false,
          userDataText: false,
          sgId: false,
          vpcId: false
        }
      };
      launchConfiguration.touched = {
          name: false, 
          accountId: false,
          kernalId: false, 
          ramDiskId: false, 
          iamRole: false, 
          ipAddressType: false,
          instanceTypeId: false,
          amiId: false,
          userDataText: false,
          sgId: false,
          vpcId: false
      };
      this.setState({item: launchConfiguration});
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
    /*
    await fetch('/vpcs',)
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
    if(name === 'purchasingOption')
    {
      item.purchasingOption = (target.checked) ? true: false;
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

      item.amiId = '';
      item.amis = [];

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
        fetch(API_BASE_URL + '/vpcs/' + (vp.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
        });
      });
     
    }
    
  }


  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
      name: true, 
      accountId: true,
      kernalId: true, 
      ramDiskId: true, 
      iamRole: true, 
      ipAddressType: true,
      instanceTypeId: true,
      amiId: true,
      userDataText: true,
      sgId: true,
      vpcId: true
    };
    const errors = this.validate(item.vpcId, item.name, item.kernalId, item.ramDiskId, item.iamRole, item.ipAddressType, item.instanceTypeId, item.amiId, 
      item.userDataText, item.sgId, item.userData, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/launchconfigurations'; 

    if(!item.userData) {
      item.userDataText = '';
      item.encoded64 = false;
    }
    item.instanceType = {id: item.instanceTypeId};
    item.ami = {id: item.amiId};
    item.vpc = {id: item.vpcId};
    item.account = {id: item.accountId};

    var values = [];
    if(item.sgs && item.sgs.length){
      item.sgs.map(s => { 
        values.push({"id": s.id});
        console.log('item.sg=' + s.id);
      });
      item.sg= values;
    }
    
    await fetch((item.id) ? API_BASE_URL + '/launchConfigurations/'+(item.id) : API_BASE_URL + '/launchConfiguration', {
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

  validate(vpcId, name, kernalId, ramDiskId, iamRole, ipAddressType, instanceTypeId, amiId, userDataText, sgId, userData, accountId) {

    const errors = {
      name: '', 
      accountId: '',
      kernalId: '', 
      ramDiskId: '', 
      iamRole: '', 
      ipAddressType: '',
      instanceTypeId: '',
      amiId: '',
      userDataText: '',
      sgId: '',
      vpcId: ''
    };

    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'name type should not be null';
      return errors;
    }
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId type should not be null';
      return errors;
    }
    if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'vpcId type should not be null';
      return errors;
    }
    else if(this.state.item.touched.kernalId && kernalId.length === 0){
      errors.kernalId = 'kernalId type should not be null';
      return errors;
    }
    else if(this.state.item.touched.ramDiskId && ramDiskId.length === 0){
      errors.ramDiskId = 'ramDiskId type should not be null';
      return errors;
    }
    else if(this.state.item.touched.iamRole && iamRole.length === 0){
      errors.iamRole = 'iamRole type should not be null';
      return errors;
    }
    if(this.state.item.touched.ipAddressType && ipAddressType.length === 0){
      errors.ipAddressType = 'ipAddressType should not be null';
      return errors;
    }
    else if(this.state.item.touched.instanceTypeId && instanceTypeId.length === 0){
      errors.instanceTypeId = 'instanceTypeId should not be null';
      return errors;
    }
    else if(this.state.item.touched.amiId && amiId.length === 0){
      errors.amiId = 'amiId should not be null';
      return errors;
    }
    else if(userData && this.state.item.touched.userDataText && userDataText.length === 0){
      errors.userDataText = 'userDataText type should not be null';
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
      this.setState({item});
  };

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit LaunchConfiguration' : 'Add LaunchConfiguration'}</h2>;

    const errors = this.validate(item.vpcId, item.name, item.kernalId, item.ramDiskId, item.iamRole, item.ipAddressType, item.instanceTypeId, item.amiId, 
      item.userDataText, item.sgId, item.userData, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/launchconfigurations";
    
    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let optVpcs = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          optVpcs.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;

    const encoded64 = (item.userData) ? <FormGroup >
            <Label for="encoded64" >Encoded64:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="encoded64" id="encoded64" 
                    onChange={this.handleChange} onBlur={this.handleBlur('encoded64')} 
                    checked={item.encoded64 === true}/>
          </FormGroup> : '';
    const userDataText = (item.userData) ? <FormGroup>
            <Label for="userDataText">User Data Text(*)</Label>
            <Input type="textarea" name="userDataText" id="userDataText" value={item.userDataText || ''} placeholder="Enter userDataText"
                   onChange={this.handleChange} onBlur={this.handleBlur('userDataText')} autoComplete="userDataText"
                   valid={errors.userDataText === ''}
                   invalid={errors.userDataText !== ''}
            />
           <FormFeedback>{errors.userDataText}</FormFeedback>
          </FormGroup> : '';
          
    
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
            <Select name="sgId" id="sgId"  placeholder="Enter Security group" isMulti 
              value={optsgs}
              onChange={e => this.onOptionChange("sgId",e)}
              onBlur={this.handleBlur('sgId')}
              options={optsg}

            />
            <FormFeedback>{errors.sgId}</FormFeedback>
          </FormGroup>;

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
                   invalid={errors.name !== ''} >
            </Input>
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
            <Label for="vpcId">Vpc (*)</Label>
            <Input type="select" name="vpcId" id="vpcId" value={item.vpcId || ''} placeholder="Enter vpc"
                   onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} autoComplete="vpcId"
                   valid={errors.vpcId === ''}
                   invalid={errors.vpcId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optVpcs}
            </Input>
           <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="kernalId">Kernal Id (*)</Label>
            <Input type="text" name="kernalId" id="kernalId" value={item.kernalId || ''} placeholder="Enter kernalId"
                   onChange={this.handleChange} onBlur={this.handleBlur('kernalId')} autoComplete="kernalId"
                   valid={errors.kernalId === ''}
                   invalid={errors.kernalId !== ''} >
            </Input>
           <FormFeedback>{errors.kernalId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="ramDiskId">Ram Disk Id (*)</Label>
            <Input type="text" name="ramDiskId" id="ramDiskId" value={item.ramDiskId || ''} placeholder="Enter ramDiskId"
                   onChange={this.handleChange} onBlur={this.handleBlur('ramDiskId')} autoComplete="ramDiskId"
                   valid={errors.ramDiskId === ''}
                   invalid={errors.ramDiskId !== ''} >
            </Input>
           <FormFeedback>{errors.ramDiskId}</FormFeedback>
          </FormGroup>

          <FormGroup >
            <Label for="purchasingOption" >Purchasing Option:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="purchasingOption" id="purchasingOption" disabled={true}
                    onChange={this.handleChange} onBlur={this.handleBlur('purchasingOption')} 
                    checked={item.purchasingOption === true}/>
          </FormGroup>

          <FormGroup>
            <Label for="iamRole">Iam Role (*)</Label>
            <Input type="text" name="iamRole" id="iamRole" value={item.iamRole || ''} placeholder="Enter iamRole"
                   onChange={this.handleChange} onBlur={this.handleBlur('iamRole')} autoComplete="iamRole"
                   valid={errors.iamRole === ''}
                   invalid={errors.iamRole !== ''} >
            </Input>
           <FormFeedback>{errors.iamRole}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="ipAddressType">Ip Address Type (*)</Label>
            <Input type="text" name="ipAddressType" id="ipAddressType" value={item.ipAddressType || ''} placeholder="Enter ipAddressType"
                   onChange={this.handleChange} onBlur={this.handleBlur('ipAddressType')} autoComplete="ipAddressType"
                   valid={errors.ipAddressType === ''}
                   invalid={errors.ipAddressType !== ''} >
            </Input>
           <FormFeedback>{errors.ipAddressType}</FormFeedback>
          </FormGroup>

          <FormGroup > 
            <Label for="monitoring" >Monitoring:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="monitoring" id="monitoring" 
                    onChange={this.handleChange} onBlur={this.handleBlur('monitoring')} 
                    checked={item.monitoring === true}/>
          </FormGroup>

          <FormGroup>
            <Label for="amiId">Ami(*)</Label>
            <Input type="select" name="amiId" id="amiId" value={item.amiId || ''} placeholder="Enter amiId"
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
            <Input type="select" name="instanceTypeId" id="instanceTypeId" value={item.instanceTypeId || ''} placeholder="Enter instanceType"
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceTypeId')} autoComplete="instanceTypeId"
                   valid={errors.instanceTypeId === ''}
                   invalid={errors.instanceTypeId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optInstanceTypes}
            </Input>
           <FormFeedback>{errors.instanceTypeId}</FormFeedback>
          </FormGroup>
          
          {securityGroup}

          <FormGroup >
            <Label for="userData" >User Data:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="userData" id="userData" 
                    onChange={this.handleChange} onBlur={this.handleBlur('userData')} 
                    checked={item.userData === true}/>
          </FormGroup>

          {encoded64}
          {userDataText}

          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(LaunchConfigurationEdit);