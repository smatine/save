import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RegionEdit extends Component {

  emptyItem = {
    name: '',
    description: '',
    touched: {
        name: false
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
      const region = await (await fetch(`${API_BASE_URL}/regions/${this.props.match.params.id}`)).json();
      region.touched = {
        name: false
      };
      this.setState({item: region});
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
        name: true
    };
    const errors = this.validate(item.name);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    //console.log('error=' + errors.name);

    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    await fetch((item.id) ? API_BASE_URL + '/regions/'+(item.id) : API_BASE_URL + '/regions', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push(FRT_BASE_URL + '/regions');
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }
  
  validate(name, mailList, owner, irtCode) {

    const errors = {
      name: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should be = 3 characters';
      return errors;
    }
    
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Region' : 'Add Region'}</h2>;
    
    const errors = this.validate(item.name);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    let accs = null;
    if(item.id) accs = <Button size="sm" color="secondary" tag={Link} to={`${FRT_BASE_URL}/region/${item.id}/azs`}>Azs</Button>;

    let isDisabledd = false;
    if(item.id && item.cidrs.length !== 0) isDisabledd = true

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter text" 
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name" 
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
                   disabled={isDisabledd}
                   />
            <FormFeedback>{errors.name}</FormFeedback>
         </FormGroup>

         <FormGroup>
            <Label for="description">Description</Label>
            <Input type="text" name="description" id="description" value={item.description || ''}
                   onChange={this.handleChange} autoComplete="description"/>
          </FormGroup>
          
          <FormGroup>
            
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={`${FRT_BASE_URL}/regions`}>Cancel</Button>

            &nbsp;&nbsp;&nbsp;&nbsp;{accs}
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(RegionEdit);