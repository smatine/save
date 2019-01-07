import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AzEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
	  region: '',
  	regionId : '',
    touched: {
      name: false,
      regionId: false
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
      const az = await (await fetch(`${API_BASE_URL}/azs/${this.props.match.params.id}`)).json();
      az.touched = {
        name: false,
        regionId: false
      };
      this.setState({item: az});
    }
    else {
      //alert(`/regions/${this.props.match.params.idt}`);      
      const region = await (await fetch(`${API_BASE_URL}/regions/${this.props.match.params.idr}`)).json();
      const az = {
        name: '',
        text: '',
        region: '',
        regionId : '',
        touched: {
          name: false,
          regionId: false
        }
      };
      az.region = region;
      az.touched = {
          name: false,
          regionId: false
      };
      this.setState({item: az});
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
          regionId: true
    };
    const errors = this.validate(item.name, item.mailList, item.regionId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/region/' + item.region.id + '/azs'; 

    item.region = {id: item.region.id};
    var values = [];
    item.subnets=[];
    if(item.subnets && item.subnets.length){
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });
      item.subnets= values;
    }


    await fetch((item.id) ? API_BASE_URL + '/regions/' + (item.region.id) + '/azs/'+(item.id) : API_BASE_URL + '/regions/' + item.region.id + '/azs', {
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

  validate(name, mailList, type, bastion, regionId) {

    const errors = {
      name: '' ,
      regionId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    
    /*if(!this.state.item.id && this.state.item.touched.regionId && regionId.length === 0){
      errors.regionId = 'region should not be null';
      return errors;
    }*/
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Az' : 'Add Az'}</h2>;

    const errors = this.validate(item.name, item.mailList, item.regionId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/region/" + item.region.id + "/azs";

    let regs = null;
    regs = <FormGroup>
            <Label for="regionId">Region: {item.region.name}</Label>
            <Input type="text" name="regionId" id="regionId" value={item.region.id || ''} disabled={true}/>
          </FormGroup>;

    let isDisabledd = false;
    if(item.id && item.subnets.length !== 0) isDisabledd = true

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
                   disabled={isDisabledd}
            />
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>
          {regs}
		      <FormGroup>
            <Label for="description">Description</Label>
            <Input type="description" name="description" id="description" value={item.description || ''}
                   onChange={this.handleChange} autoComplete="description"/>
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

export default withRouter(AzEdit);