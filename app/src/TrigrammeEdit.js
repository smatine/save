import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class TrigrammeEdit extends Component {

  emptyItem = {
    name: '',
    mailList:'',
    owner: '',
    irtCode:'',
    description: '',
    errors: {},
    touched: {
        name: false,
        mailList: false,
        owner: false,
        irtCode: false
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
      const trigramme = await (await fetch(`${API_BASE_URL}/trigrammes/${this.props.match.params.id}`)).json();
      trigramme.touched = {
        name: false,
        mailList: false,
        owner: false,
        irtCode: false,
        emailState: ''
      };
      this.setState({item: trigramme});
    }
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
        mailList: true,
        owner: true,
        irtCode: true,
        emailState: ''
    };
    const errors = this.validate(item.name, item.mailList, item.owner, item.irtCode);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    await fetch((item.id) ? API_BASE_URL + '/trigrammes/'+(item.id) : API_BASE_URL + '/trigrammes', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });

    
    this.props.history.push(FRT_BASE_URL + '/trigrammes');
  }

  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { item } = this.state
      if (emailRex.test(e.target.value)) {
        item.touched.emailState = 'has-success'
      } else {
        item.touched.emailState = 'has-danger'
      }
      this.setState({ item })
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }
  
  validate(name, mailList, owner, irtCode) {

    const errors = {
      name: '',
      mailList: '',
      owner: '',
      irtCode: ''
    };
 // true means invalid, so our conditions got reversed  email.split('').filter(x ==> x === '@').length !== 1)
    /*return {
      name: name.length === 0,
      irCode: irtCode.length === 0,
    };*/
    
    if(this.state.item.touched.name && name.length !== 3){
      errors.name = 'Name should be = 3 characters';
      return errors;
    }
    else if(this.state.item.touched.irtCode && irtCode.length !== 5){
      errors.irtCode = 'Irt Code should be = 5 characters!';
      return errors;
    }
    
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(this.state.item.touched.owner && !emailRex.test(owner)){
      errors.owner = 'Owner mail should have correct format ';
      return errors;
    }

    if(this.state.item.touched.mailList && !emailRex.test(mailList)){
      errors.mailList = 'Mailling List should have correct format ';
      return errors;
    }
    
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit TRI' : 'Add TRI'}</h2>;
    
    const errors = this.validate(item.name, item.mailList, item.owner, item.irtCode);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    /*let accs = null;
    if(item.id) accs = <Button size="sm" color="secondary" tag={Link} to={"/trigramme/" + item.id + "/products"}>Products</Button>;*/

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          
          <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter text" maxLength="3"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name" 
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
                   />
            <FormFeedback>{errors.name}</FormFeedback>
         </FormGroup>
         
          <FormGroup>
            <Label for="owner">Owner (*)</Label>
            <Input type="email" name="owner" id="owner" value={item.owner || ''} placeholder="Enter Name"
                   onChange={this.handleChange} onBlur={this.handleBlur('owner')} autoComplete="owner"
                   valid={errors.owner === ''}
                   invalid={errors.owner !== ''}
            />
            <FormFeedback>{errors.owner}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="irtCode">IRT Code (*)</Label>
            <Input type="text" name="irtCode" id="irtCode" value={item.irtCode || ''} placeholder="Enter IRT Code" maxLength="5"
                   onChange={this.handleChange} onBlur={this.handleBlur('irtCode')} autoComplete="irtCode"
                   valid={errors.irtCode === ''}
                   invalid={errors.irtCode !== ''}
            />
            <FormFeedback>{errors.irtCode}</FormFeedback>
          </FormGroup>
          
       
          
          <FormGroup>
            <Label for="mailList">Email address (*)</Label>
            <Input type="email" name="mailList" id="mailList" value={item.mailList || ''} 
                   placeholder="Enter email"
                   onChange={this.handleChange} onBlur={this.handleBlur('mailList')} autoComplete="mailList"
                   valid={errors.mailList === ''}
                   invalid={errors.mailList !== ''}
                   onChange={ (e) => {
                            this.handleChange(e)
                           }}
            />
            <FormFeedback>{errors.mailList}</FormFeedback>
          </FormGroup>


         <FormGroup>
            <Label for="description">Description</Label>
            <Input type="text" name="description" id="description" value={item.description || ''}
                   onChange={this.handleChange} autoComplete="description"/>
          </FormGroup>
          
          <FormGroup>
            
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={FRT_BASE_URL + "/trigrammes"}>Cancel</Button>

            
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(TrigrammeEdit);