import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

const cidrRegex = require('cidr-regex');
class RuleEdit extends Component {

  emptyItem = {
    type: '',
    number: '', 
    ruleType: '', 
    protocol:'', 
    portRange:'', 
    cidr: '',
    allow:'',
    text: '',
    nacl: {},
    touched: {
      type: false,
      number: false, 
      ruleType: false, 
      protocol: false, 
      portRange: false,
      cidr: false,
      allow:false
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
      const rule = await (await fetch(`${API_BASE_URL}/rules/${this.props.match.params.id}`)).json();
      rule.touched = {
        type: false,
        number: false, 
        ruleType: false, 
        protocol: false, 
        portRange: false, 
        cidr: false,
        allow: false
      };
      this.setState({item: rule});
      
    }
    else {
      const nacl = await (await fetch(`${API_BASE_URL}/nacls/${this.props.match.params.idn}`)).json();
      const rule = {
        number: '', 
        ruleType: '', 
        protocol:'', 
        portRange:'', 
        cidr: '',
        allow: '',
        type: '',
        text: '',
        nacl: {},
        touched: {
          type: false,
          number: false, 
          ruleType: false, 
          protocol: false, 
          portRange: false, 
          cidr: false,
          allow: false
        }
      };
      rule.nacl = nacl;
      rule.touched = {
          type: false,
          number: false, 
          ruleType: false, 
          protocol: false, 
          portRange: false, 
          cidr: false,
          allow: false
      };
      this.setState({item: rule});
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
          number: true, 
          ruleType: true, 
          protocol: true, 
          portRange: true, 
          cidr: true,
          allow: true
    };
    const errors = this.validate(item.type, item.number, item.ruleType, item.protocol, item.portRange, item.cidr, item.allow);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/nacl/' + item.nacl.id +'/rules'; 

    item.nacl={id: item.nacl.id};
    
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/nacls/' + (item.nacl.id) + '/rules/'+(item.id) : API_BASE_URL + '/nacls/' + item.nacl.id + '/rules', {
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

  validate(type, number, ruleType, protocol, portRange, cidr, allow) {

    const errors = {
      type: '',
      number: '', 
      ruleType: '', 
      protocol:'', 
      portRange:'', 
      cidr: '',
      allow: ''
    };
    //console.log('type' + type);
    
    if(this.state.item.touched.type && type.length === 0){
      errors.type = 'Type should not be null';
      return errors;
    }
    else if(this.state.item.touched.number && number.length === 0){
      errors.number = 'Rule should not be null';
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
    else if(this.state.item.touched.allow && allow.length === 0){
      errors.allow = 'Deny/Allow should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit rule' : 'Add rule'}</h2>;

    const errors = this.validate(item.type, item.number, item.ruleType, item.protocol, item.portRange, item.cidr, item.allow);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/nacl/" + item.nacl.id + "/rules";

    let nacl = null;
    nacl = <FormGroup>
            <Label for="naclId">Nacl: {item.nacl.name}</Label>
            <Input type="text" name="naclId" id="naclId" value={item.nacl.id || ''} disabled="true"/>
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
          {nacl}
        
          <FormGroup>
            <Label for="number">Rule (*)</Label>
            <Input type="text" name="number" id="number" value={item.number || ''} placeholder="Enter rule"
                   onChange={this.handleChange} onBlur={this.handleBlur('number')} autoComplete="number"
                   valid={errors.number === ''}
                   invalid={errors.number !== ''}
            />
           <FormFeedback>{errors.number}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ruleType">Type (*)</Label>
            <Input type="select" name="ruleType" id="ruleType" value={item.ruleType || ''} onChange={this.handleChange} onBlur={this.handleBlur('ruleType')} 
                 valid={errors.ruleType === ''}
                 invalid={errors.ruleType !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="ruleType1">ruleType1</option>
              <option value="ruleType2">ruleType2</option>
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
            <Label for="allow">Deny/Allow (*)</Label>
            <Input type="select" name="allow" id="allow" value={item.allow || ''} onChange={this.handleChange} onBlur={this.handleBlur('allow')} 
                 valid={errors.allow === ''}
                 invalid={errors.allow !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Deny">Deny</option>
              <option value="Allow">Allow</option>
            </Input>
            <FormFeedback>{errors.allow}</FormFeedback>
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

export default withRouter(RuleEdit);