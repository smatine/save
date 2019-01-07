import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class PolicyEdit extends Component {

  emptyItem = {
    name: '',
    description: '', 
    policyJson: '',
	  account: {},
    accounts: [],
  	accountId : '',
    touched: {
      name: false,
      accountId: false,
      policyJson: false
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

      const policy = await (await fetch(`${API_BASE_URL}/policys/${this.props.match.params.id}`)).json();
      policy.touched = {
        name: false,
        accountId: false,
        policyJson: false
      };
      this.setState({item: policy});
      
      let item = {...this.state.item};
      item.accountId = policy.account.id;
      this.setState({item: item});
      
    }
    else {
      const policy = {
        name: '',
        description: '', 
        policyJson: '',
        account: {},
        accounts: [],
        accountId : '',
        touched: {
          name: false,
          accountId: false,
          policyJson: false
        }
      };
      policy.touched = {
          name: false,
          accountId: false,
          policyJson: false
      };
      this.setState({item: policy});
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
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
      name: true,
      accountId: true,
      policyJson: true
    };
    const errors = this.validate(item.name, item.accountId, item.policyJson);

    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/policys'; 

    item.account={id: item.accountId};
    
    var values = [];
      item.roles.map(s => { 
        values.push({"id": s.id});
      });
      item.roles = values;
    
    var values = [];
      item.groups.map(s => { 
        values.push({"id": s.id});
      });
      item.groups = values;

    var values = [];
      item.endPoints.map(s => { 
        values.push({"id": s.id});
      });
      item.endPoints = values;
    

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/policys/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/policys', {
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

  validate(name, accountId, policyJson) {

    const errors = {
      name: '' ,
      accountId: '',
      policyJson: ''
    };
    

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Vpc should not be null';
      return errors;
    }

    if(this.state.item.touched.policyJson && policyJson.length === 0){
      errors.policyJson = 'policyJson should not be null';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Policy' : 'Add Policy'}</h2>;

    const errors = this.validate(item.name, item.accountId, item.policyJson);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/policys";

    
    let opts = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let isUsed = false; 
    if(item.id !== '' && ((item.roles && item.roles.length !== 0) || (item.groups && item.groups.length !== 0) || (item.endPoints && item.endPoints.length !== 0)) ) isUsed = true; 
    
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
            <Label for="policyJson">Policy (*)</Label>
            <Input type="textarea" name="policyJson" id="policyJson" value={item.policyJson || ''} placeholder="Enter policyJson" disabled={isUsed}
                   onChange={this.handleChange} onBlur={this.handleBlur('policyJson')} autoComplete="policyJson"
                   valid={errors.policyJson === ''}
                   invalid={errors.policyJson !== ''}
            />
           <FormFeedback>{errors.policyJson}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="description">Description (*)</Label>
            <Input type="text" name="description" id="description" value={item.description || ''} placeholder="Enter description" 
                   onChange={this.handleChange} onBlur={this.handleBlur('description')} autoComplete="description"
                   
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

export default withRouter(PolicyEdit);