import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';


class ListenerEdit extends Component {

  emptyItem = {
    protocole: '',
    port:'',
    lb: {},
    targetGroup: {},
    targetGroups: [],
    targetGroupId : '',
    touched: {
      protocole: false,
      port: false,
      targetGroupId : false
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
    let vpcId = 0;
    let listenerId = -1;
    if (this.props.match.params.id !== 'new') {
      const listener = await (await fetch(`${API_BASE_URL}/listeners/${this.props.match.params.id}`)).json();
      listener.touched = {
        protocole: false,
        port: false,
        targetGroupId : false
      };
      this.setState({item: listener});
      let item = {...this.state.item};
      item.targetGroupId = listener.targetGroup.id;
      vpcId = listener.lb.vpc.id;
      listenerId = listener.id;
      this.setState({item: item});
    }
    else {
      const lb = await (await fetch(`${API_BASE_URL}/lbs/${this.props.match.params.idl}`)).json();
      const listener = {
        protocole: '',
        port:'',
        lb: {},
        touched: {
          protocole: false,
          port: false,
          targetGroupId : false
        }
      };
      listener.lb = lb;
      listener.touched = {
          protocole: false,
          port: false,
          targetGroupId : false
      };
      vpcId = lb.vpc.id;
      this.setState({item: listener});
    }
    
    //await fetch('/targetGroups',) /vpcs/{vp}/listeners/{listenerId}/targetGroups
    await fetch(API_BASE_URL + '/vpcs/' + (vpcId) + '/listeners/' + (listenerId) + '/targetGroups',) 
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.targetGroups = jsonResult;
      this.setState({item: item});
    })

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
          protocole: true,
          port: true,
          targetGroupId : true
    };
    const errors = this.validate(item.protocole, item.port, item.targetGroupId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/lb/' + item.lb.id +'/listeners'; 

    item.lb={id: item.lb.id};
    item.targetGroup={id: item.targetGroupId};
    //console.log("sma" + item.targetGroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/lbs/' + (item.lb.id) + '/listeners/'+(item.id) : API_BASE_URL + '/lbs/' + item.lb.id + '/listeners', {
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

  validate(protocole, port, targetGroupId) {

    const errors = {
      protocole: '',
      port: '',
      targetGroupId: ''
    };
    //console.log('type' + type);
    if(this.state.item.touched.protocole && protocole.length === 0){
      errors.protocole = 'protocole should not be null';
      return errors;
    } 
    else if(this.state.item.touched.port && port.length === 0){
      errors.port = 'port should not be null';
      return errors;
    } 
    else if(this.state.item.touched.targetGroupId && targetGroupId.length === 0){
      errors.targetGroupId = 'targetGroupId should not be null';
      return errors;
    } 
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit listener' : 'Add listener'}</h2>;

    const errors = this.validate(item.protocole, item.port, item.targetGroupId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/lb/" + item.lb.id + "/listeners";

    let opts = [];
    if(item.targetGroups && item.targetGroups.length){
      item.targetGroups.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let tg = item.targetGroupId || '';
    item.targetGroupId = tg;

    let lb = null;
    lb = <FormGroup>
            <Label for="lbId">load Balancer: {item.lb.name}</Label>
            <Input type="text" name="lbId" id="lbId" value={item.lb.id || ''} disabled="true"/>
          </FormGroup>;

    const optionTcp = (item.lb.type !== 'ALB') ? <option value="TCP">TCP</option> : '';
    const optionHttp = (item.lb.type !== 'NLB') ? <option value="HTTP">HTTP</option> : '';
    const optionHttps = (item.lb.type !== 'NLB') ? <option value="HTTPS">HTTPS</option> : '';
    const optionHssl = (item.lb.type === 'ELB') ? <option value="SSL">TCP SSL</option> : '';
    
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          {lb}
          
          <FormGroup>
            <Label for="type">Protocole (*)</Label>
            <Input type="select" name="protocole" id="protocole" value={item.protocole || ''} onChange={this.handleChange} onBlur={this.handleBlur('protocole')} 
                 valid={errors.protocole === ''}
                 invalid={errors.protocole !== ''}
            >
              <option value="" disabled>Choose</option>
              {optionTcp}{optionHttp}{optionHttps}{optionHssl}
            </Input>
            <FormFeedback>{errors.protocole}</FormFeedback>
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
            <Label for="targetGroupId">Target Group (*)</Label>
            <Input type="select" name="targetGroupId" id="targetGroupId"  value={tg} onChange={this.handleChange} onBlur={this.handleBlur('targetGroupId')}
                 valid={errors.targetGroupId === ''}
                 invalid={errors.targetGroupId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.targetGroupId}</FormFeedback>
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

export default withRouter(ListenerEdit);