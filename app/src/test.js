import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormText, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class TrigrammeEdit extends Component {

  emptyItem = {
    name: '',
    value:'',
    owner: '',
    validate: {
        emailState: ''
      }
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const trigramme = await (await fetch(`/trigrammes/${this.props.match.params.id}`)).json();
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

    await fetch((item.id) ? '/trigrammes/'+(item.id) : '/trigrammes', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/trigrammes');
  }

  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { item } = this.state
      if (emailRex.test(e.target.value)) {
        item.validate.emailState = 'has-success'
      } else {
        item.validate.emailState = 'has-danger'
      }
      this.setState({ item })
  }

  function validate(name, irtCode, mailList) {
    // true means invalid, so our conditions got reversed
    return {
      name: name.length === 0,
      irCode: irtCode.length === 0,
    };
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit TRI' : 'Add TRI'}</h2>;
    
    const errors = validate(this.state.name, this.state.irtCode, this.state.mailList);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter text" maxLength="30"
                   autoComplete="name"
                   valid={ item.validate.emailState === 'has-success' }
                   invalid={ item.validate.emailState === 'has-danger' }
                   required 
                   onChange={ (e) => {
                            this.validateEmail(e)
                            this.handleChange(e)
                           }}/>
            <FormText>Your username is most likely your email.</FormText>
            <FormFeedback valid>That's a tasty looking email you've got there.</FormFeedback>
            <FormFeedback invalid>Uh oh! Looks like there is an issue with your email. Please input a correct email.</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="owner">Owner</Label>
            <Input type="text" name="owner" id="owner" value={item.owner || ''}
                   onChange={this.handleChange} autoComplete="owner"/>
          </FormGroup>


          <FormGroup>
            <Label for="irtCode">IRT Code</Label>
            <Input type="text" name="irtCode" id="irtCode" value={item.irtCode || ''} placeholder="Enter text" maxLength="5"
                   onChange={this.handleChange} autoComplete="irtCode"/>
          </FormGroup>
          <FormGroup>
            <Label for="appName">APP Name</Label>
            <Input type="text" name="appName" id="appName" value={item.appName || ''}
                   onChange={this.handleChange} autoComplete="appName"/>
          </FormGroup>
          <FormGroup>
            <Label for="mailList">Email address</Label>
            <Input type="email" name="mailList" id="mailList" value={item.mailList || ''} 
                   placeholder="Enter email"
                   onChange={this.handleChange} autoComplete="mailList"/>
          </FormGroup>


         <FormGroup>
            <Label for="description">Description</Label>
            <Input type="text" name="description" id="description" value={item.description || ''}
                   onChange={this.handleChange} autoComplete="description"/>
          </FormGroup>
          
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/trigrammes">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(TrigrammeEdit);