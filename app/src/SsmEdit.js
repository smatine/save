import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SsmEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
	  account: {},
  	accountId : '',
    type: 'String', 
    keyKmsId: '', 
    value: '',
    touched: {
      name: false,
      accountId: false,
      type: false,
      keyKmsId: false, 
      value: false
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
      const ssm = await (await fetch(`${API_BASE_URL}/ssms/${this.props.match.params.id}`)).json();
      ssm.touched = {
        name: false,
        accountId: false,
        type: false,
        keyKmsId: false, 
        value: false
      };
      this.setState({item: ssm});

      let item = {...this.state.item};
      item.accountId = ssm.account.id;
      this.setState({item: item});
      
    }
    else {
      const ssm = {
        name: '',
        text: '',
        account: {},
        accountId : '',
        type: 'String', 
        keyKmsId: '', 
        value: '',
        touched: {
          name: false,
          accountId: false,
          type: false,
          keyKmsId: false, 
          value: false
        }
      };
      ssm.touched = {
          name: false,
          accountId: false,
          type: false,
          keyKmsId: false, 
          value: false
      };
      this.setState({item: ssm});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.account = jsonResult;
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
          type: true,
          keyKmsId: true, 
          value: true
    };
    const errors = this.validate(item.name, item.accountId, item.type, item.keyKmsId, item.value);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/ssms'; 

    item.account={id: item.accountId};
    if(this.state.item.type !== 'SecureString')
    {
      item.keyKmsId = '';
    }

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/ssms/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/ssms', {
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

  validate(name, accountId, type, keyKmsId, value) {

    const errors = {
      name: '' ,
      accountId: '',
      type: '',
      keyKmsId: '',
      value: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'account should not be null';
      return errors;
    }
    else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }
    else if(this.state.item.type === 'SecureString' && this.state.item.touched.keyKmsId && keyKmsId.length === 0){
      errors.keyKmsId = 'keyKmsId should not be null';
      return errors;
    }
    else if(this.state.item.touched.value && value.length === 0){
      errors.value = 'value should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit SSM Parameter Store' : 'Add SSM Parameter Store'}</h2>;

    const errors = this.validate(item.name, item.accountId, item.type, item.keyKmsId, item.value);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/ssms";

    
    let opts = [];
    if(item.account && item.account.length){
      item.account.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    

    let tri = item.accountId || '';
    item.accountId = tri;

    let type = item.type || '';
    item.type = type;

    const keyKms = (item.type === 'SecureString') ?  <FormGroup>
            <Label for="keyKmsId">Key Kms Id (*)</Label>
            <Input type="text" name="keyKmsId" id="keyKmsId" value={item.keyKmsId || ''} placeholder="Enter keyKmsId"
                   onChange={this.handleChange} onBlur={this.handleBlur('keyKmsId')} autoComplete="keyKmsId"
                   valid={errors.keyKmsId === ''}
                   invalid={errors.keyKmsId !== ''}
            />
           <FormFeedback>{errors.keyKmsId}</FormFeedback>
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
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>

          <FormGroup>
            <Label for="accountId">accounts (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup>
         
          <FormGroup>
            <Label for="type">Type (*)</Label>
            <Input type="select" name="type" id="type"  value={type} onChange={this.handleChange} onBlur={this.handleBlur('type')}
                 valid={errors.type === ''}
                 invalid={errors.type !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="String">String</option>
              <option value="StringList">StringList</option>
              <option value="SecureString">SecureString</option>
            </Input>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>

          {keyKms}

          <FormGroup>
            <Label for="value">Value (*)</Label>
            <Input type="textarea" name="value" id="value" value={item.value || ''} placeholder="Enter value"
                   onChange={this.handleChange} onBlur={this.handleBlur('value')} autoComplete="value"
                   valid={errors.value === ''}
                   invalid={errors.value !== ''}
            />
           <FormFeedback>{errors.value}</FormFeedback>
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

export default withRouter(SsmEdit);