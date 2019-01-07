import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class EndPointEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    serviceName: '', 
    fullAccess: true,
	  vpc: {},
    vpcs: [],
  	vpcId : '',
    routeTable: {},
    routeTables: [],
    routeTableId : '',
    policy: {},
    policys: [],
    policyId : '',
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      serviceName: false,
      routeTableId: false,
      policyId: false
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

      const endPoint = await (await fetch(`${API_BASE_URL}/endPoints/${this.props.match.params.id}`)).json();
      endPoint.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        serviceName: false,
        routeTableId: false,
        policyId: false
      };
      this.setState({item: endPoint});
      
      let item = {...this.state.item};
      item.vpcId = endPoint.vpc.id;
      item.accountId = endPoint.account.id;
      item.routeTableId = endPoint.routeTable.id;
      item.policyId = (endPoint.policy) ? endPoint.policy.id : '';

      
      
      await fetch(API_BASE_URL + '/accounts/' + (endPoint.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        //let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await (await fetch(API_BASE_URL + '/vpcs/' + (endPoint.vpc.id) + '/routeTables',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.routeTables = jsonResult;
          this.setState({item: item});
        }));

      await (await fetch(API_BASE_URL + '/accounts/' + (endPoint.account.id) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.policys = jsonResult;
          this.setState({item: item});
        }));
      
      

      this.setState({item: item});
      
    }
    else {
      const endPoint = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        serviceName: '', 
        fullAccess: true,
        vpc: {},
        vpcs: [],
        vpcId : '',
        routeTable: {},
        routeTables: [],
        routeTableId : '',
        policy: {},
        policys: [],
        policyId : '',
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          serviceName: false,
          routeTableId: false,
          policyId: false
        }
      };
      endPoint.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          serviceName: false,
          routeTableId: false,
          policyId: false
      };
      this.setState({item: endPoint});
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
    
    if(name === 'fAccess')
    {
      if(value === 'Yes'){
        item.fullAccess = true;
      }
      else
      {
        item.fullAccess = false;
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
      item.policyId = '';
      item.policys = [];
      item.routeTableId = '';
      item.routeTables = [];
    }
    if(name === 'vpcId')
    {
    
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/routeTables',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.routeTables = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/accounts/' + (item.accountId) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.policys = jsonResult;
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
      serviceName: true,
      routeTableId: true,
      policyId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.serviceName, item.routeTableId, item.policyId, item.accountId);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/endpoints'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    item.routeTable={id: item.routeTableId};
    
    if(item.fullAccess)
    {
      item.policy = null;
    }
    else
    {
      item.policy={id: item.policyId};
    }
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/endPoints/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/endPoints', {
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

  validate(name, vpcId, serviceName, routeTableId, policyId, accountId) {

    const errors = {
      name: '',
      accountId: '',
      vpcId: '',
      serviceName: '',
      routeTableId: '',
      policyId: ''
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
    
    if(this.state.item.touched.serviceName && serviceName.length === 0){
      errors.serviceName = 'serviceName should not be null';
      return errors;
    } 

    if(this.state.item.touched.routeTableId && routeTableId.length === 0){
      errors.routeTableId = 'routeTableId should not be null';
      return errors;
    }

    if(!this.state.item.fullAccess && this.state.item.touched.policyId && policyId.length === 0){
      errors.policyId = 'policyId should not be null';
      return errors;
    }
   
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit EndPoint' : 'Add EndPoint'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.serviceName, item.routeTableId, item.policyId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/endpoints";

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
    
    let optsp = [];
    if(item.policys && item.policys.length){
      item.policys.map(s => {  
          optsp.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let policy = item.policyId || '';
    item.policyId = policy;

    let optsr = [];
    if(item.routeTables && item.routeTables.length){
      item.routeTables.map(s => {  
          optsr.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let routeTable = item.routeTableId || '';
    item.routeTableId = routeTable;

    let serviceName = item.serviceName || '';
    item.serviceName = serviceName;
    
    const fullAccess = item.fullAccess;

    const policys = (!item.fullAccess) ? <FormGroup>
            <Label for="policyId">Policy (*)</Label>
            <Input type="select" name="policyId" id="policyId"  value={policy} onChange={this.handleChange} onBlur={this.handleBlur('policyId')}
                 valid={errors.policyId === ''}
                 invalid={errors.policyId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsp}
            </Input>
            <FormFeedback>{errors.policyId}</FormFeedback>
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
            <Label for="vpcId">Vpc (*)</Label>
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
            <Label for="serviceName">Service Name (*)</Label>
            <Input type="select" name="serviceName" id="serviceName" value={serviceName} 
                   onChange={this.handleChange} onBlur={this.handleBlur('serviceName')} 
                   valid={errors.serviceName === ''}
                   invalid={errors.serviceName !== ''}
                  >
                  <option value="" disabled>Choose</option>
                  <option value="com.amazonaws.eu-west-1.s3:Gateway">com.amazonaws.eu-west-1.s3: Gateway</option>
                  <option value="com.amazonaws.eu-west-1.dynamodb:Gateway">com.amazonaws.eu-west-1.dynamodb: Gateway</option>
            </Input>
           <FormFeedback>{errors.serviceName}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="routeTableId">Route Table (*)</Label>
            <Input type="select" name="routeTableId" id="routeTableId"  value={routeTable} onChange={this.handleChange} onBlur={this.handleBlur('routeTableId')}
                 valid={errors.routeTableId === ''}
                 invalid={errors.routeTableId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsr}
            </Input>
            <FormFeedback>{errors.routeTableId}</FormFeedback>
          </FormGroup>

          <FormGroup tag="fieldset">
            <Label for="fAccess">Access (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="fAccess" id="fAccess" value="Yes" checked={fullAccess === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('fAccess')} autoComplete="fAccess"
                       valid={errors.fAccess === ''}
                       invalid={errors.fAccess !== ''}
                />{' '}
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="fAccess" id="fAccess" value="No" checked={fullAccess === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('fAccess')} autoComplete="fAccess"
                       valid={errors.fAccess === ''}
                       invalid={errors.fAccess !== ''}
                />{' '}
                No
              </Label>
            </FormGroup>
            <FormFeedback>{errors.fAccess}</FormFeedback>
          </FormGroup>

          {policys}

          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(EndPointEdit);