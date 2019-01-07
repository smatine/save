import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
const cidrRegex = require('cidr-regex');
class TargetEdit extends Component {

  emptyItem = {
    
    port: '',
    targetGroup: {},
    eccId:'',
    ecc:{},
    eccs:[],
    touched: {
      
      port: false,
      eccId: false
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
      const target = await (await fetch(`${API_BASE_URL}/targets/${this.props.match.params.id}`)).json();
      target.touched = {
        port: false,
        eccId: false
      };
      this.setState({item: target});
      let item = {...this.state.item};
      item.eccId = target.ecc.id;
      this.setState({item: item});
      
    }
    else {
      const targetGroup = await (await fetch(`${API_BASE_URL}/targetGroups/${this.props.match.params.idt}`)).json();
      const target = {
          port: '',
          targetGroup: {},
          eccId:'',
          ecc:{},
          eccs:[],
          touched: {
            port: false,
            eccId: false
          }
      };
      target.targetGroup = targetGroup;
      target.touched = {
          port: false,
          eccId: false
      };
      this.setState({item: target});
    }

    let item = {...this.state.item};
    await fetch(API_BASE_URL + '/vpcs/'  + item.targetGroup.vpc.id + '/eccs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.eccs = jsonResult;
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

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          port: true,
          eccId: true
    };
    const errors = this.validate(item.port, item.eccId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
     item.port = Number(item.port);
     item.ecc = {id: item.eccId};
    //console.log("port" + item.port);
    //return;
    const hist= FRT_BASE_URL + '/targetgroup/' + item.targetGroup.id +'/targets'; 

    item.targetGroup={id: item.targetGroup.id};
    

    await fetch((item.id) ? API_BASE_URL + '/targetGroups/' + (item.targetGroup.id) + '/targets/'+(item.id) : API_BASE_URL + '/targetGroups/' + (item.targetGroup.id) + '/targets', {
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

  validate(port, eccId) {

    const errors = {
      
      port:'',
      eccId:''
    };
    
    if(this.state.item.touched.eccId && eccId.length === 0){
      errors.eccId = 'Ec2 should not be null';
      return errors;
    } 
    if(this.state.item.touched.port && port.length === 0){
      errors.port = 'port should not be null';
      return errors;
    } 
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit target' : 'Add target'}</h2>;

    const errors = this.validate(item.port, item.eccId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/targetgroup/" + item.targetGroup.id + "/targets";

    const prop = item.propagation;

    let targetgroup = null;
    targetgroup = <FormGroup>
            <Label for="targetgroupId">Target Group: {item.targetGroup.name}</Label>
            <Input type="text" name="targetgroupId" id="targetgroupId" value={item.targetGroup.id || ''} disabled="true"/>
          </FormGroup>;

    let optEccs = [];
    if(item.eccs && item.eccs.length){
      item.eccs.map(s => {  
          optEccs.push(<option value={s.id}>{s.id} {s.name} {s.subnet.az.name} </option>);
      });
    }
    let ecc = item.eccId || '';
    item.eccId = ecc;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          {targetgroup}

          <FormGroup>
            <Label for="eccId">Ec2 (*)</Label>
            <Input type="select" name="eccId" id="eccId" value={item.eccId || ''} placeholder="Enter ecc"
                   onChange={this.handleChange} onBlur={this.handleBlur('eccId')} autoComplete="eccId"
                   valid={errors.eccId === ''}
                   invalid={errors.eccId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optEccs}
            </Input>
           <FormFeedback>{errors.eccId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="port">Port (*)</Label>
            <Input type="number" name="port" id="port" value={item.port || ''} placeholder="Enter port"
                   onChange={this.handleChange} onBlur={this.handleBlur('port')} autoComplete="port"
                   valid={errors.port === ''}
                   invalid={errors.port !== ''}
            />
           <FormFeedback>{errors.port}</FormFeedback>
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

export default withRouter(TargetEdit);