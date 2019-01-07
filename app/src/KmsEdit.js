import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class KmsEdit extends Component {

  emptyItem = {
    alias: '',
	  account: {},
    accounts: [],
  	accountId : '',
    roles: [],
    roless: [],
    roleId: [],
    text: '', 
    keyMaterialOrigin: 'Kms',
    policy: {},
    policys: [],
    policyId : '',
    users: [],
    userss: [],
    userId: [],
    touched: {
      alias: false,
      accountId: false,
      roleId: false,
      keyMaterialOrigin: false,
      policyId : false,
      userId: false
      
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

      const kms = await (await fetch(`${API_BASE_URL}/kmss/${this.props.match.params.id}`)).json();
      kms.touched = {
        alias: false,
        accountId: false,
        roleId: false,
        keyMaterialOrigin: false,
        policyId : false,
        userId: false
      };
      this.setState({item: kms});

      let account={};
      await (await fetch(API_BASE_URL + "/accounts/" + kms.account.id,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        account = jsonResult;
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/roles',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.roless = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/users',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.userss = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.policys = jsonResult;
          this.setState({item: item});
        });
      }));
      
      let item = {...this.state.item};
      item.accountId = kms.account.id;
      item.policyId = kms.policy.id;
      var values = [];
      if(item.roles) item.roles.map(s => { 
        values.push({"id": s.id});
      });
      item.roles = values;

      values = [];
      if(item.users) item.users.map(s => { 
        values.push({"id": s.id});
      });
      item.users = values;

      values = [];
      if(item.policys) item.policys.map(s => { 
        values.push({"id": s.id});
      });
      item.policys = values;
      
      this.setState({item: item});
      
    }
    else {
      const kms = {
        alias: '',
        account: {},
        accounts: [],
        accountId : '',
        roles: [],
        roless: [],
        roleId: [],
        text: '', 
        keyMaterialOrigin: 'Kms',
        policy: {},
        policys: [],
        policyId : '',
        touched: {
          alias: false,
          accountId: false,
          roleId: false,
          keyMaterialOrigin: false,
          policyId : false,
          userId: false
        }
      };
      kms.touched = {
          alias: false,
          accountId: false,
          roleId: false,
          keyMaterialOrigin: false,
          policyId : false,
          userId: false
      };
      this.setState({item: kms});
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
     
    if(name === 'accessType')
    {
      if(value === 'Kms'){
        item.keyMaterialOrigin = 'Kms';
      }
      else
      {
        item.keyMaterialOrigin = 'External';
      }
    }
   
    if(name === 'accountId')
    {

      let account={};
      fetch(API_BASE_URL + "/accounts/" + item.accountId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        account = jsonResult;
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/roles',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.roless = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/users',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.userss = jsonResult;
          this.setState({item: item});
        });
        fetch(API_BASE_URL + '/accounts/' + (account.id) + '/policys',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.policys = jsonResult;
          this.setState({item: item});
        });
      });

    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
      alias: true,
      accountId: true,
      roleId: true,
      keyMaterialOrigin: true,
      policyId : true,
      userId: true
    };
    const errors = this.validate(item.alias, item.accountId, item.roleId, item.keyMaterialOrigin, item.policyId, item.userId);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/kmss'; 

    item.account={id: item.accountId};
    item.policy={id: item.policyId};


    var values = [];
      item.users.map(s => { 
        values.push({"id": s.id});
      });
      item.users = values;

    var values = [];
      item.roles.map(s => { 
        values.push({"id": s.id});
      });
      item.roles = values;

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/kmss/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/kmss', {
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

  validate(alias, accountId,  roleId, keyMaterialOrigin, policyId, userId) {

    const errors = {
      alias: '',
      accountId: '',
      roleId: '',
      keyMaterialOrigin: '',
      policyId: '',
      userId: ''
    };
    

    if(this.state.item.touched.alias && alias.length === 0){
      errors.alias = 'alias should not be null';
      return errors;
    }
    
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Vpc should not be null';
      return errors;
    }

    if(this.state.item.touched.keyMaterialOrigin && keyMaterialOrigin.length === 0){
      errors.keyMaterialOrigin = 'keyMaterialOrigin should not be null';
      return errors;
    }
/*
    if(this.state.item.touched.userId && userId.length === 0){
      errors.userId = 'userId should not be null';
      return errors;
    }
    */ 
    if(this.state.item.touched.policyId && policyId.length === 0){
      errors.policyId = 'policyId should not be null';
      return errors;
    }
    /*
    if(this.state.item.touched.roleId  && this.state.item.roles.length === 0){
      errors.roleId = 'Add roleId.';
      return errors;
    }
*/  
    return errors;
  }


  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'roleId') 
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.roless && item.roless.length){
              item.roless.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.roles = values;
      }
      if(selectName === 'userId') 
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.userss && item.userss.length){
              item.userss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.users = values;
      }
      
      this.setState({item});
  };


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Kms' : 'Add Kms'}</h2>;

    const errors = this.validate(item.alias, item.accountId, item.roleId, item.keyMaterialOrigin, item.policyId, item.userId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/kmss";

    
    let opts = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let isUsed = false; 
    //if(item.id !== '' && (item.kmss && item.kmss.length !== 0)  ) isUsed = true; 
    
    let optsp = [];  
    let optsps = [];
    if(item.roless && item.roless.length){
      item.roless.map(s => {  
          if(item.roles && item.roles.length) item.roles.map(ss => {
             if(s.id == ss.id) {
               optsp.push({value: s.id, label: s.name});
             }
          });
          optsps.push({value: s.id, label: s.name});
      });
    }

    let optsu = [];  
    let optsus = [];
    if(item.userss && item.userss.length){
      item.userss.map(s => {  
          if(item.users && item.users.length) item.users.map(ss => {
             if(s.id == ss.id) {
               optsu.push({value: s.id, label: s.name});
             }
          });
          optsus.push({value: s.id, label: s.name});
      });
    }
    
    let optpolicys = [];
    if(item.policys && item.policys.length){
      item.policys.map(s => {  
          optpolicys.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let policy = item.policyId || '';
    item.policyId = policy;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
 
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="alias">Alias (*)</Label> 
            <Input type="text" name="alias" id="alias" value={item.alias || ''} placeholder="Enter alias" disabled={isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('alias')} autoComplete="alias"
                   valid={errors.alias === ''}
                   invalid={errors.alias !== ''}
            />
           
           <FormFeedback>{errors.alias}</FormFeedback>
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
            <Label for="policyId">Policy (*)</Label>
            <Input type="select" name="policyId" id="policyId"  value={policy} onChange={this.handleChange} onBlur={this.handleBlur('policyId')} disabled={isUsed}
                 valid={errors.policyId === ''}
                 invalid={errors.policyId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optpolicys}
            </Input>
            <FormFeedback>{errors.policyId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="roleId">Roles</Label>
            <Select name="roleId" id="roleId"  placeholder="Enter roleId" isMulti disabled={isUsed}
              value={optsp}
              onChange={e => this.onOptionChange("roleId",e)}
              onBlur={this.handleBlur('roleId')}
              options={optsps}

            />
            <FormFeedback>{errors.roleId}</FormFeedback> 
          </FormGroup>

          <FormGroup>
            <Label for="userId">Users</Label>
            <Select name="userId" id="userId"  placeholder="Enter userId" isMulti disabled={isUsed}
              value={optsu}
              onChange={e => this.onOptionChange("userId",e)}
              onBlur={this.handleBlur('userId')}
              options={optsus}
            />
            <FormFeedback>{errors.userId}</FormFeedback> 
          </FormGroup>

           <FormGroup tag="fieldset">
            <Label for="accessType">Key Material Origin</Label>

            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="Kms" checked={item.keyMaterialOrigin === 'Kms'}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                Kms
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="External" checked={item.keyMaterialOrigin === 'External'}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                External
              </Label>
            </FormGroup>
            
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="text">Description</Label> 
            <Input type="text" name="text" id="text" value={item.text || ''} placeholder="Enter text" disabled={isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('text')} autoComplete="text"
                  
            />
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

export default withRouter(KmsEdit);