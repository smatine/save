import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AmiEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
    region: '',
    regionId : '',
    amiId:'',
    touched: {
      name: false,
      regionId: false,
      amiId: false
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
      const ami = await (await fetch(`${API_BASE_URL}/amis/${this.props.match.params.id}`)).json();
      ami.touched = {
        name: false,
        regionId: false,
        amiId: false
      };
      this.setState({item: ami});
    }
    else {
      //alert(`/regions/${this.props.match.params.idt}`);      
      const region = await (await fetch(`${API_BASE_URL}/regions/${this.props.match.params.idr}`)).json();
      const ami = {
        name: '',
        text: '',
        region: '',
        regionId : '',
        amiId:'',
        touched: {
          name: false,
          regionId: false,
          amiId: false
        }
      };
      ami.region = region;
      ami.touched = {
          name: false,
          regionId: false,
          amiId: false
      };
      this.setState({item: ami});
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
          regionId: true,
          amiId: true
    };
    const errors = this.validate(item.name, item.regionId, item.amiId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/region/' + item.region.id + '/amis'; 

    item.region = {id: item.region.id};
    
    await fetch((item.id) ? API_BASE_URL + '/regions/' + (item.region.id) + '/amis/'+(item.id) : API_BASE_URL + '/regions/' + item.region.id + '/amis', {
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

  validate(name, regionId, amiId) {

    const errors = {
      name: '' ,
      regionId: '',
      amiId:''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.amiId && amiId.length === 0){
      errors.amiId = 'amiId should not be null';
      return errors;
    }

    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Ami' : 'Add Ami'}</h2>;

    const errors = this.validate(item.name, item.regionId, item.amiId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/region/" + item.region.id + "/amis";

    let regs = null;
    regs = <FormGroup>
            <Label for="regionId">Region: {item.region.name}</Label>
            <Input type="text" name="regionId" id="regionId" value={item.region.id || ''} disabled={true}/>
          </FormGroup>;

    let isDisabledd = false;
    //if(item.id && item.subnets.length !== 0) isDisabledd = true

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
          <FormGroup>
            <Label for="amiId">Ami Id</Label>
            <Input type="text" name="amiId" id="amiId" value={item.amiId || ''} placeholder="Enter amiId"
                   onChange={this.handleChange} onBlur={this.handleBlur('amiId')} autoComplete="amiId"
                   valid={errors.amiId === ''}
                   invalid={errors.amiId !== ''}
                   disabled={isDisabledd}
            />
           <FormFeedback>{errors.amiId}</FormFeedback>
          </FormGroup>
          {regs}
          <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
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

export default withRouter(AmiEdit);