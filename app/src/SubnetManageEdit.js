import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

const cidrRegex = require('cidr-regex');
//also npm install range_check
class SubnetManageEdit extends Component {

  emptyItem = {
    subnetCidr: '',
    text: '',
	  cidr: '',
    subnet: {},
    touched: {
      subnetCidr: false,
      cidrId: false
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
      const subnetCidr = await (await fetch(`${API_BASE_URL}/subnetcidrs/${this.props.match.params.id}`)).json();
      subnetCidr.touched = {
        subnetCidr: false,
        cidrId: false
      };

      this.setState({item: subnetCidr});
    }
    else {
      const cidr = await (await fetch(`${API_BASE_URL}/cidrs/${this.props.match.params.idc}`)).json();
      const subnetCidr = {
        subnetCidr: '',
        text: '',
        cidr: '',
        subnet: {},
        touched: {
          subnetCidr: false,
          cidrId: false
        }
      };
      subnetCidr.cidr = cidr;
      subnetCidr.touched = {
        subnetCidr: false,
        cidrId: false
      };
      this.setState({item: subnetCidr});
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
        subnetCidr: true,
        cidrId: true
    };
    const errors = this.validate(item.subnetCidr, item.cidrId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) 
    {
      this.forceUpdate();
      return;
    }
    const hist= FRT_BASE_URL + '/vpcmanages/' + item.cidr.id + '/subnetmanage'; // /vpcmanages/:idc/subnetmanage/:id

    
    
    let t = 0;

    if(item.id && item.subnet && item.subnet.id) {
        //console.log("subnet");
        t = item.subnet.id;
        item.subnet= {};
    }else {
      item.subnet= null;
    }
    //console.log("subnet" + item.subnet.id);

    await fetch((item.id) ? API_BASE_URL + '/cidrs/' + (item.cidr.id) + '/subnetcidrs/'+(item.id) + '/subnet/' + (t) : API_BASE_URL + '/cidrs/' + item.cidr.id + '/subnetcidrs', {
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

  validate(subnetCidr, cidrId) {

    const errors = {
      subnetCidr: '',
      cidrId: ''
    };
    
    if(this.state.item.touched.subnetCidr && subnetCidr.length === 0){
      errors.subnetCidr = 'subnet should not be null';
      return errors;
    }
    if(this.state.item.touched.subnetCidr && !cidrRegex({exact: true}).test(subnetCidr))
    {
      errors.subnetCidr = 'subnet should  be a cidr format';
      return errors;
    }
    /*if(!this.state.item.id && this.state.item.touched.trigrammeId && trigrammeId.length === 0){
      errors.trigrammeId = 'trigramme should not be null';
      return errors;
    }*/
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Subnet Cidr' : 'Add Subnet Cidr'}</h2>;
    
    const errors = this.validate(item.subnetCidr, item.cidrId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/vpcmanages/" + item.cidr.id + "/subnetmanage"; // /vpcmanages/:idc/subnetmanage/:id

    let cidrs = null;
    cidrs = <FormGroup>
            <Label for="cidrId">Cidr: {item.cidr.cidr}</Label>
            <Input type="text" name="cidrId" id="cidrId" value={item.cidr.id || ''} disabled={true}/>
          </FormGroup>;

    let isDisabledd = false;
    if(item.subnet && item.subnet.id) isDisabledd = true;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="subnetCidr">Subnet</Label>
            <Input type="text" name="subnetCidr" id="subnetCidr" value={item.subnetCidr || ''}
                   onChange={this.handleChange} onBlur={this.handleBlur('subnetCidr')} autoComplete="subnetCidr"
                    valid={errors.subnetCidr === ''}
                   invalid={errors.subnetCidr !== ''}
                   disabled={isDisabledd}
            />
            <FormFeedback>{errors.subnetCidr}</FormFeedback>
          </FormGroup>
		  
		  {cidrs}
		  
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

export default withRouter(SubnetManageEdit);