import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class InstanceTypeEdit extends Component {

  emptyItem = {
    family:'', 
    type:'', 
    vcpus:'', 
    memory:'', 
    instanceStorage:'', 
    ebsOptimized: true, 
    networkPerformance:'',
    touched: {
      family: false, 
      type: false,
      vcpus: false,
      memory: false,
      instanceStorage: false, 
      networkPerformance: false
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
      const instanceType = await (await fetch(`${API_BASE_URL}/instanceTypes/${this.props.match.params.id}`)).json();
      instanceType.touched = {
        family: false, 
        type: false,
        vcpus: false,
        memory: false,
        instanceStorage: false, 
        networkPerformance: false
      };
      this.setState({item: instanceType});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'ebsOptimized')
    {
      item.ebsOptimized = (target.checked) ? true: false;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    
    item.touched = { 
      family: true, 
      type: true,
      vcpus: true,
      memory: true,
      instanceStorage: true, 
      networkPerformance: true
    };
    const errors = this.validate(item.family, item.type, item.vcpus, item.memory, item.instanceStorage, item.networkPerformance);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    var values = [];
    item.eccs=[];
    if(item.eccs && item.eccs.length){
      item.eccs.map(s => { 
        values.push({"id": s.id});
      });
      item.eccs= values;
    }

    await fetch((item.id) ? API_BASE_URL + '/instanceTypes/'+(item.id) : API_BASE_URL + '/instanceType', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });

    
    this.props.history.push(FRT_BASE_URL + '/instanceTypes');
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }
  
  validate(family, type, vcpus, memory, instanceStorage, networkPerformance) {

    const errors = {
      family: '', 
      type: '',
      vcpus: '',
      memory: '',
      instanceStorage: '', 
      networkPerformance: ''
    };
    
    if(this.state.item.touched.family && family.length === 0){
      errors.family = 'family should not be null';
      return errors;
    } else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    } else if(this.state.item.touched.vcpus && vcpus.length === 0){
      errors.vcpus = 'vcpus should not be null';
      return errors;
    }else if(this.state.item.touched.memory && memory.length === 0){
      errors.memory = 'memory should not be null';
      return errors;
    } else if(this.state.item.touched.instanceStorage && instanceStorage.length === 0){
      errors.instanceStorage = 'instanceStorage should not be null';
      return errors;
    } else if(this.state.item.touched.networkPerformance && networkPerformance.length === 0){
      errors.networkPerformance = 'networkPerformance should not be null';
      return errors;
    }
    
    
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Instance Type' : 'Add Instance Type'}</h2>;
    
    const errors = this.validate(item.family, item.type, item.vcpus, item.memory, item.instanceStorage, item.networkPerformance);
    const isDisabled = Object.keys(errors).some(x => errors[x]);


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          
          <FormGroup>
            <Label for="family">Family (*)</Label>
            <Input type="text" name="family" id="family" value={item.family || ''} placeholder="Enter family" 
                   onChange={this.handleChange} onBlur={this.handleBlur('family')} autoComplete="family" 
                   valid={errors.family === ''}
                   invalid={errors.family !== ''}
                   />
            <FormFeedback>{errors.family}</FormFeedback>
         </FormGroup>
         
         <FormGroup>
            <Label for="type">Type (*)</Label>
            <Input type="text" name="type" id="type" value={item.type || ''} placeholder="Enter type" 
                   onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type" 
                   valid={errors.type === ''}
                   invalid={errors.type !== ''}
                   />
            <FormFeedback>{errors.type}</FormFeedback>
         </FormGroup>

         <FormGroup>
            <Label for="vcpus">vCPUs (*)</Label>
            <Input type="number" name="vcpus" id="vcpus" value={item.vcpus || ''} placeholder="Enter vcpus" 
                   onChange={this.handleChange} onBlur={this.handleBlur('vcpus')} autoComplete="vcpus" 
                   valid={errors.vcpus === ''}
                   invalid={errors.vcpus !== ''}
                   />
            <FormFeedback>{errors.vcpus}</FormFeedback>
         </FormGroup>

         <FormGroup>
            <Label for="memory">Memory (GiB) (*)</Label>
            <Input type="number" name="memory" id="memory" value={item.memory || ''} placeholder="Enter memory" 
                   onChange={this.handleChange} onBlur={this.handleBlur('memory')} autoComplete="memory" 
                   valid={errors.memory === ''}
                   invalid={errors.memory !== ''}
                   />
            <FormFeedback>{errors.memory}</FormFeedback>
         </FormGroup>

         <FormGroup>
            <Label for="instanceStorage">Instance Storage (GB) (*)</Label>
            <Input type="text" name="instanceStorage" id="instanceStorage" value={item.instanceStorage || ''} placeholder="Enter instanceStorage" 
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceStorage')} autoComplete="instanceStorage" 
                   valid={errors.instanceStorage === ''}
                   invalid={errors.instanceStorage !== ''}
                   />
            <FormFeedback>{errors.instanceStorage}</FormFeedback>
         </FormGroup>

         <FormGroup >
            <Label for="ebsOptimized" >EBS-Optimized Available:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="ebsOptimized" id="ebsOptimized" onChange={this.handleChange} onBlur={this.handleBlur('ebsOptimized')} 
                    checked={item.ebsOptimized === true}/>
          </FormGroup>


         <FormGroup>
            <Label for="networkPerformance">Network Performance (*)</Label>
            <Input type="text" name="networkPerformance" id="networkPerformance" value={item.networkPerformance || ''} placeholder="Enter networkPerformance" 
                   onChange={this.handleChange} onBlur={this.handleBlur('networkPerformance')} autoComplete="networkPerformance" 
                   valid={errors.networkPerformance === ''}
                   invalid={errors.networkPerformance !== ''}
                   />
            <FormFeedback>{errors.networkPerformance}</FormFeedback>
         </FormGroup>

          <FormGroup>   
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={FRT_BASE_URL + "/instanceTypes"}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(InstanceTypeEdit);