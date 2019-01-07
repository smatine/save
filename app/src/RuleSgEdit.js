import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

const cidrRegex = require('cidr-regex');
class RuleSgEdit extends Component {

  emptyItem = {
    type: '',
    ruleType: '', 
    protocol:'', 
    portRange:'', 
    cidr: '',
    text: '',
    sg: {},
    touched: {
      type: false,
      ruleType: false, 
      protocol: false, 
      portRange: false,
      cidr: false
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
      const ruleSg = await (await fetch(`${API_BASE_URL}/ruleSgs/${this.props.match.params.id}`)).json();
      ruleSg.touched = {
        type: false, 
        ruleType: false, 
        protocol: false, 
        portRange: false, 
        cidr: false
      };
      this.setState({item: ruleSg});
      
    }
    else {
      const sg = await (await fetch(`${API_BASE_URL}/sgs/${this.props.match.params.ids}`)).json();
      const ruleSg = {
        ruleType: '', 
        protocol:'', 
        portRange:'', 
        cidr: '',
        type: '',
        text: '',
        sg: {},
        touched: {
          type: false, 
          ruleType: false, 
          protocol: false, 
          portRange: false, 
          cidr: false
        }
      };
      ruleSg.sg = sg;
      ruleSg.touched = {
          type: false, 
          ruleType: false, 
          protocol: false, 
          portRange: false, 
          cidr: false
      };
      this.setState({item: ruleSg});
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
          type: true, 
          ruleType: true, 
          protocol: true, 
          portRange: true, 
          cidr: true
    };
    const errors = this.validate(item.type, item.ruleType, item.protocol, item.portRange, item.cidr);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/sg/' + item.sg.id +'/ruleSgs'; 

    item.sg={id: item.sg.id};
    
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/sgs/' + (item.sg.id) + '/ruleSgs/'+(item.id) : API_BASE_URL + '/sgs/' + item.sg.id + '/ruleSgs', {
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

  validate(type, ruleType, protocol, portRange, cidr) {

    const errors = {
      type: '', 
      ruleType: '', 
      protocol:'', 
      portRange:'', 
      cidr: ''
    };
    
    if(this.state.item.touched.type && type.length === 0){
      errors.type = 'Type should not be null';
      return errors;
    }
    else if(this.state.item.touched.ruleType && ruleType.length === 0){
      errors.ruleType = 'Type should not be null';
      return errors;
    }
    else if(this.state.item.touched.protocol && protocol.length === 0){
      errors.protocol = 'Protocol should not be null';
      return errors;
    }
    else if(this.state.item.touched.portRange && portRange.length === 0){
      errors.portRange = 'Portrange should not be null';
      return errors;
    }
    else if(this.state.item.touched.cidr && !cidrRegex({exact: true}).test(cidr)){
      errors.cidr = 'Cidr should  be a cidr format';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit ruleSg' : 'Add ruleSg'}</h2>;

    const errors = this.validate(item.type, item.ruleType, item.protocol, item.portRange, item.cidr);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/sg/" + item.sg.id + "/ruleSgs";

    let sg = null;
    sg = <FormGroup>
            <Label for="sgId">Sg: {item.sg.name}</Label>
            <Input type="text" name="sgId" id="sgId" value={item.sg.id || ''} disabled={true}/>
          </FormGroup>;


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="type">In/Out (*)</Label>
            <Input type="select" name="type" id="type" value={item.type || ''} onChange={this.handleChange} onBlur={this.handleBlur('type')} 
                 valid={errors.type === ''}
                 invalid={errors.type !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="INBOUND">INBOUND</option>
              <option value="OUTBOUND">OUTBOUND</option>
            </Input>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>
          {sg}

          <FormGroup>
            <Label for="ruleType">Type (*)</Label>
            <Input type="select" name="ruleType" id="ruleType" value={item.ruleType || ''} onChange={this.handleChange} onBlur={this.handleBlur('ruleType')} 
                 valid={errors.ruleType === ''}
                 invalid={errors.ruleType !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="ruleSgType1">ruleSgType1</option>
              <option value="ruleSgType2">ruleSgType2</option>
            </Input>
            <FormFeedback>{errors.ruleType}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="protocol">Protocol (*)</Label>
            <Input type="select" name="protocol" id="protocol" value={item.protocol || ''} onChange={this.handleChange} onBlur={this.handleBlur('protocol')} 
                 valid={errors.protocol === ''}
                 invalid={errors.protocol !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="protocol1">protocol1</option>
              <option value="protocol2">protocol2</option>
            </Input>
            <FormFeedback>{errors.protocol}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="portRange">Port Range (*)</Label>
            <Input type="text" name="portRange" id="portRange" value={item.portRange || ''} placeholder="Enter portRange"
                   onChange={this.handleChange} onBlur={this.handleBlur('portRange')} autoComplete="portRange"
                   valid={errors.portRange === ''}
                   invalid={errors.portRange !== ''}
            />
           <FormFeedback>{errors.portRange}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="cidr">Source/Destination (*)</Label>
            <Input type="text" name="cidr" id="cidr" value={item.cidr || ''} placeholder="Enter cidr"
                   onChange={this.handleChange} onBlur={this.handleBlur('cidr')} autoComplete="cidr"
                   valid={errors.cidr === ''}
                   invalid={errors.cidr !== ''}
            />
           <FormFeedback>{errors.cidr}</FormFeedback>
          </FormGroup>
          
          
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

export default withRouter(RuleSgEdit);