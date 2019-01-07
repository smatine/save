import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RoleEdit extends Component {
policies
  emptyItem = {
    name: '',
    description: '', 
    serviceName: '',
	  account: {},
    accounts: [],
  	accountId : '',
    policys: [],
    policyss: [],
    policyId: [],
    touched: {
      name: false,
      accountId: false,
      serviceName: false,
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

      const role = await (await fetch(`${API_BASE_URL}/roles/${this.props.match.params.id}`)).json();
      role.touched = {
        name: false,
        accountId: false,
        serviceName: false,
        policyId: false
      };
      this.setState({item: role});

      let account={};
      await (await fetch(API_BASE_URL + "/accounts/" + role.account.id,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        account = jsonResult;
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.policyss = jsonResult;
          this.setState({item: item});
        });
      }));
      
      let item = {...this.state.item};
      item.accountId = role.account.id;
      var values = [];
      item.policys.map(s => { 
        values.push({"id": s.id});
      });
      item.policys = values;
      
      this.setState({item: item});
      
    }
    else {
      const role = {
        name: '',
        description: '', 
        serviceName: '',
        account: {},
        accounts: [],
        accountId : '',
        policys: [],
        policyss: [],
        policyId: [],
        touched: {
          name: false,
          accountId: false,
          roleJson: false,
          policyId: false
        }
      };
      role.touched = {
          name: false,
          accountId: false,
          serviceName: false,
          policyId: false
      };
      this.setState({item: role});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    })

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

      let account={};
      fetch(API_BASE_URL + "/accounts/" + item.accountId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        account = jsonResult;
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.policyss = jsonResult;
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
      serviceName: true,
      policyId: true
    };
    const errors = this.validate(item.name, item.accountId, item.serviceName, item.policyId);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/roles'; 

    item.account={id: item.accountId};
    
    

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/roles/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/roles', {
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

  validate(name, accountId, serviceName, policyId) {

    const errors = {
      name: '' ,
      accountId: '',
      serviceName: '',
      policyId: ''
    };
    

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Vpc should not be null';
      return errors;
    }

    if(this.state.item.touched.serviceName && serviceName.length === 0){
      errors.serviceName = 'serviceName should not be null';
      return errors;
    }

/*
    if(this.state.item.touched.policyId  && this.state.item.policys.length === 0){
      errors.policyId = 'Add policyId.';
      return errors;
    }
*/  
    return errors;
  }


  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'policyId') 
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.policyss && item.policyss.length){
              item.policyss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.policys = values;
      }
      
      this.setState({item});
  };


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Role' : 'Add Role'}</h2>;

    const errors = this.validate(item.name, item.accountId, item.serviceName, item.policyId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/roles";

    
    let opts = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let isUsed = false; 
    //if(item.id !== '' && ((item.roles && item.roles.length !== 0) || (item.groups && item.groups.length !== 0) || (item.endPoints && item.endPoints.length !== 0)) ) isUsed = true; 
    let optsp = [];  
    let optsps = [];
    if(item.policyss && item.policyss.length){
      item.policyss.map(s => {  
          if(item.policys && item.policys.length) item.policys.map(ss => {
             if(s.id == ss.id) {
               optsp.push({value: s.id, label: s.name});
             }
          });
          optsps.push({value: s.id, label: s.name});
      });
    }
        
    return <div>
      <AppNavbar/>
      <Container>
        {title}
 
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name (*)</Label> 
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name" disabled={isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
           <FormText>Use alphanumeric and '+=,.@-_' characters. Maximum 64 characters.</FormText>
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="accountId">Account (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')} disabled={isUsed}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="serviceName">Service Name (*)</Label>         
            <Input type="select" name="serviceName" id="serviceName" value={item.serviceName || ''} disabled={isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('serviceName')} 
                   valid={errors.serviceName === ''}
                   invalid={errors.serviceName !== ''}
                   >
                  <option value="" disabled>Choose</option>
                  <option value="AutoScaling">Auto Scaling</option>
                  <option value="DynamoDB">DynamoDB</option>
                  <option value="EC2">EC2</option>
                  <option value="ElasticLoadBalancing">ElasticLoadBalancing</option>
                  <option value="ElasticCache">ElasticCache</option>
                  <option value="EKS">EKS</option>
                  <option value="Lambda">Lambda</option>
                  <option value="Rds">Rds</option>
                  <option value="S3">S3</option>
                  <option value="SNS">SNS</option>
            </Input>
           <FormFeedback>{errors.serviceName}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="policyId">Policies</Label>
            <Select name="policyId" id="policyId"  placeholder="Enter policyId" isMulti 
              value={optsp}
              onChange={e => this.onOptionChange("policyId",e)}
              onBlur={this.handleBlur('policyId')}
              options={optsps}

            />
            <FormFeedback>{errors.policyId}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="description">Description (*)</Label> 
            <Input type="text" name="description" id="description" value={item.description || ''} placeholder="Enter description" 
                   onChange={this.handleChange} onBlur={this.handleBlur('description')} autoComplete="description"
                   
            />
            <FormText>Maximum 1000 characters. Use alphanumeric and '+=,.@-_' characters</FormText>
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

export default withRouter(RoleEdit);