import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

const cidrRegex = require('cidr-regex');
class RouteEdit extends Component {

  emptyItem = {
    destination: '',
    propagation:'',
    text: '',
    targetType: 'L',
    peering:{},
    peerings:[],
    peeringId:'',
    endPoint:{},
    endPoints:[],
    endPointId:'',
    target:'Local',
    routeTable: {},
    touched: {
      destination: false,
      propagation: false,
      target: false,
      peeringId: false,
      endPointId: false,
      targetType: false
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
      const route = await (await fetch(`${API_BASE_URL}/routes/${this.props.match.params.id}`)).json();
      route.touched = {
        destination: false,
        propagation: false,
        target: false,
        peeringId: false,
        endPointId: false,
        targetType: false
      };
      this.setState({item: route});

      let item = {...this.state.item};
      if(route.peering) item.peeringId = route.peering.id;
      if(route.endPoint) item.endPointId = route.endPoint.id;
      this.setState({item: item});
      
    }
    else {
      const routeTable = await (await fetch(`${API_BASE_URL}/routeTables/${this.props.match.params.idr}`)).json();
      const route = {
        destination: '',
        propagation:'',
        text: '',
        target: 'Local',
        targetType: 'L',
        peering:{},
        peerings:[],
        peeringId:'',
        endPoint:{},
        endPoints:[],
        endPointId:'',
        routeTable: {},
        touched: {
          destination: false,
          propagation: false,
          target: false,
          peeringId: false,
          endPointId: false,
          targetType: false
        }
      };
      route.routeTable = routeTable;
      route.touched = {
          destination: false,
          propagation: false,
          target: false,
          peeringId: false,
          endPointId: false,
          targetType: false
      };
      this.setState({item: route});
    }

    let item = {...this.state.item};
    await fetch(API_BASE_URL + '/vpcs/' + item.routeTable.vpc.id + '/endPoints',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.endPoints = jsonResult;
      this.setState({item: item});
    });

    await fetch(API_BASE_URL + '/vpcs/' + item.routeTable.vpc.id + '/peerings',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.peerings = jsonResult;
      this.setState({item: item});
    });



  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'propagation')
    {
      if(value === 'prop'){
       //prop
        item.propagation = true;
      }
      else
      {
        //noprop
        item.propagation = false;
      }
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          destination: true,
          propagation: true,
          target: true,
          peeringId: true,
          endPointId: true,
          targetType: true
    };
    const errors = this.validate(item.destination, item.peeringId, item.endPointId, item.target, item.propgation, item.targetType);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/routetable/' + item.routeTable.id +'/routes'; 

    item.routeTable={id: item.routeTable.id};
    
    if(item.targetType === 'L')
    {
      item.peering = null;
      item.endPoint = null;
    }
    else if(item.targetType === 'P')
    {

      item.target = '';
      item.endPoint = null;
      item.peering={id: item.peeringId};
    }
    else if(item.targetType === 'E')
    {

      item.peering = null;
      item.target = '';
      item.endPoint={id: item.endPointId};
    }

    await fetch((item.id) ? API_BASE_URL + '/routetables/' + (item.routeTable.id) + '/routes/'+(item.id) : API_BASE_URL + '/routetables/' + item.routeTable.id + '/routes', {
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

  validate(destination, peeringId, endPointId, target, propgation, targetType) {

    const errors = {
      destination: '',
      propgation: '',
      target:'',
      peeringId:'',
      endPointId:'',
      targetType: ''

    };
    
    if(this.state.item.touched.destination && destination.length === 0){
      errors.destination = 'Destination should not be null';
      return errors;
    } 
    else if(this.state.item.touched.targetType && targetType.length === 0){
      errors.targetType = 'targetType should not be null';
      return errors;
    } 
    else if(targetType === 'L' && this.state.item.touched.target && target.length === 0){
      errors.target = 'Target should not be null';
      return errors;
    } 
    else if(targetType === 'P' && this.state.item.touched.peeringId && peeringId.length === 0){
      errors.peeringId = 'peeringId should not be null';
      return errors;
    } 
    else if(targetType === 'E' && this.state.item.touched.endPointId && endPointId.length === 0){
      errors.endPointId = 'endPointId should not be null';
      return errors;
    } 
    else if(this.state.item.touched.propgation && propgation.length === 0){
      errors.propgation = 'Propgation should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit route' : 'Add route'}</h2>;

    const errors = this.validate(item.destination, item.peeringId, item.endPointId, item.target, item.propgation, item.targetType);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/routetable/" + item.routeTable.id + "/routes";

    const prop = item.propagation;

    let routetable = null;
    routetable = <FormGroup>
            <Label for="routetableId">Nacl: {item.routeTable.name}</Label>
            <Input type="text" name="routetableId" id="routetableId" value={item.routeTable.id || ''} disabled="true"/>
          </FormGroup>;

    let optps = [];
    if(item.peerings && item.peerings.length){
      item.peerings.map(s => {  
          optps.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let peering = item.peeringId || '';
    item.peeringId = peering;

    let optes = [];
    if(item.endPoints && item.endPoints.length){
      item.endPoints.map(s => {  
          optes.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let endPoint = item.endPointId || '';
    item.endPointId = endPoint;
    
    item.target = 'Local';
    let target = (item.targetType === 'L') ? <FormGroup>
            <Label for="target">Target (*):</Label>
            <Input type="text" name="target" id="target" value={item.target || ''} placeholder="Enter target" disabled='true'
                   onChange={this.handleChange} onBlur={this.handleBlur('target')} autoComplete="target"
                   valid={errors.target === ''}
                   invalid={errors.target !== ''}
            />
           <FormFeedback>{errors.target}</FormFeedback>
          </FormGroup> : '';
    
    let peerings = (item.targetType === 'P') ? <FormGroup>
            <Label for="peeringId">Peering (*)</Label>
            <Input type="select" name="peeringId" id="peeringId"  value={peering} onChange={this.handleChange} onBlur={this.handleBlur('peeringId')}
                 valid={errors.peeringId === ''}
                 invalid={errors.peeringId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optps}
            </Input>
            <FormFeedback>{errors.peeringId}</FormFeedback>
          </FormGroup> : '';


    let endPoints = (item.targetType === 'E') ? <FormGroup>
            <Label for="endPointId">End Point (*)</Label>
            <Input type="select" name="endPointId" id="endPointId"  value={endPoint} onChange={this.handleChange} onBlur={this.handleBlur('endPointId')}
                 valid={errors.endPointId === ''}
                 invalid={errors.endPointId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optes}
            </Input>
            <FormFeedback>{errors.endPointId}</FormFeedback>
          </FormGroup> : '';

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          {routetable}
          <FormGroup>
            <Label for="destination">Destination (*)</Label>
            <Input type="text" name="destination" id="destination" value={item.destination || ''} placeholder="Enter destination"
                   onChange={this.handleChange} onBlur={this.handleBlur('destination')} autoComplete="destination"
                   valid={errors.destination === ''}
                   invalid={errors.destination !== ''}
            />
           <FormFeedback>{errors.destination}</FormFeedback>
          </FormGroup>



          <FormGroup>
            <Label for="targetType">Target Type (*)</Label>
            <Input type="select" name="targetType" id="targetType" value={item.targetType || ''} 
                   onChange={this.handleChange} onBlur={this.handleBlur('targetType')} 
                   valid={errors.targetType === ''}
                   invalid={errors.targetType !== ''}
              >            
              <option value="" disabled>Choose</option>
              <option value="L">Local</option>
              <option value="P">Peering</option>
              <option value="E">EndPoint</option>
            </Input>
           <FormFeedback>{errors.targetType}</FormFeedback>
          </FormGroup>


          {target}
          {peerings}
          {endPoints}

          <FormGroup tag="fieldset">
            <Label for="propagation">Propagated (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="propagation" id="propagation" value="prop" checked={prop === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('propagation')} autoComplete="propagation"
                       valid={errors.propagation === ''}
                       invalid={errors.propagation !== ''}
                />{' '}
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="propagation" id="propagation" value="noprop" checked={prop === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('propagation')} autoComplete="propagation"
                       valid={errors.propagation === ''}
                       invalid={errors.propagation !== ''}
                />{' '}
                No
              </Label>
            </FormGroup>
            <FormFeedback>{errors.accessType}</FormFeedback>
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

export default withRouter(RouteEdit);