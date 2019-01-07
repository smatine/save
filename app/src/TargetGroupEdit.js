import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class TargetGroupEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    text: '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    protocole : '', 
    port : '', 
    type : '', 
    hcprotocole : '', 
    hcpath : '', 
    ahport : '', 
    ahhealthythreshold : '', 
    ahuhealthythreshold : '', 
    ahtimeout : '', 
    ahtinterval : '', 
    ahsucesscode : '',
    ahportoverride: false,
    deregistrationDelay:'', 
    shortStartDuration:'', 
    stickySession: false,
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      protocole : false, 
      port : false, 
      type : false, 
      hcprotocole : false, 
      hcpath : false, 
      ahport : false, 
      ahhealthythreshold : false, 
      ahuhealthythreshold : false, 
      ahtimeout : false, 
      ahtinterval : false, 
      ahsucesscode : false,
      deregistrationDelay: false, 
      shortStartDuration: false
  
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

      const targetgroup = await (await fetch(`${API_BASE_URL}/targetGroups/${this.props.match.params.id}`)).json();
      targetgroup.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        protocole : false, 
        port : false, 
        type : false, 
        hcprotocole : false, 
        hcpath : false, 
        ahport : false, 
        ahhealthythreshold : false, 
        ahuhealthythreshold : false, 
        ahtimeout : false, 
        ahtinterval : false, 
        ahsucesscode : false,
        deregistrationDelay: false, 
        shortStartDuration: false
      };
      this.setState({item: targetgroup});
      
       await fetch(API_BASE_URL + '/accounts/' + (targetgroup.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });
      
      let item = {...this.state.item};
      item.vpcId = targetgroup.vpc.id;
      item.accountId = targetgroup.account.id;
      this.setState({item: item});
      
    }
    else {
      const targetgroup = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        protocole : '', 
        port : '', 
        type : '', 
        hcprotocole : '', 
        hcpath : '', 
        ahport : '', 
        ahhealthythreshold : '', 
        ahuhealthythreshold : '', 
        ahtimeout : '', 
        ahtinterval : '', 
        ahsucesscode : '',
        ahportoverride: false,
        deregistrationDelay:'', 
        shortStartDuration:'', 
        stickySession: false,
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          protocole : false, 
          port : false, 
          type : false, 
          hcprotocole : false, 
          hcpath : false, 
          ahport : false, 
          ahhealthythreshold : false, 
          ahuhealthythreshold : false, 
          ahtimeout : false, 
          ahtinterval : false, 
          ahsucesscode : false,
          deregistrationDelay: false, 
          shortStartDuration: false
        }
      };
      targetgroup.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          protocole : false, 
          port : false, 
          type : false, 
          hcprotocole : false, 
          hcpath : false, 
          ahport : false, 
          ahhealthythreshold : false, 
          ahuhealthythreshold : false, 
          ahtimeout : false, 
          ahtinterval : false, 
          ahsucesscode : false,
          deregistrationDelay: false, 
          shortStartDuration: false
      };
      this.setState({item: targetgroup});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });
    /*
    await fetch('/vpcs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    })*/

  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
    if(name === 'accessType')
    {
      if(value === 'override'){
       //hide 
        item.ahportoverride = true;
      }
      else
      {
        //show
        item.ahportoverride = false;
      }
    }
    if(name === 'stickySession')
    {
      item.stickySession = (target.checked) ? true: false;
    }
    if(name === 'accountId')
    {
       fetch(API_BASE_URL + '/accounts/' + (item.accountId) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });
      item.vpcId = '';
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          accountId: true,
          vpcId: true,
          protocole : true, 
          port : true, 
          type : true, 
          hcprotocole : true, 
          hcpath : true, 
          ahport : true, 
          ahhealthythreshold : true, 
          ahuhealthythreshold : true, 
          ahtimeout : true, 
          ahtinterval : true, 
          ahsucesscode : true,
          deregistrationDelay: true, 
          shortStartDuration: true
    };
    const errors = this.validate(item.name, item.vpcId, item.protocole, item.port, item.type, item.hcprotocole, item.hcpath, item.ahport, item.ahhealthythreshold, 
      item.ahuhealthythreshold, item.ahtimeout, item.ahtinterval, item.ahsucesscode, item.ahportoverride, item.deregistrationDelay, item.shortStartDuration, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/targetgroups'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};

    if(!item.ahportoverride)  item.ahport = item.port;

    if(item.listener) item.listener={id: item.listener.id};

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/targetGroups/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/targetGroups', {
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

  validate(name, vpcId, protocole, port, type, hcprotocole, hcpath, ahport, ahhealthythreshold, ahuhealthythreshold, ahtimeout, 
    ahtinterval, ahsucesscode, ahportoverride, deregistrationDelay, shortStartDuration, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      protocole: '', 
      port: '', 
      type: '',
      hcprotocole: '',
      hcpath: '',
      ahport: '',
      ahhealthythreshold: '',
      ahuhealthythreshold: '',
      ahtimeout: '',
      ahtinterval: '',
      ahsucesscode: '',
      deregistrationDelay: '', 
      shortStartDuration: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.touched.port && port.length === 0){
      errors.port = 'port should not be null';
      return errors;
    }
    else if(this.state.item.touched.protocole && protocole.length === 0){
      errors.protocole = 'protocole should not be null';
      return errors;
    }
    else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }
    else if(this.state.item.touched.hcprotocole && hcprotocole.length === 0){
      errors.hcprotocole = 'protocole should not be null';
      return errors;
    }
    else if(this.state.item.touched.hcpath && hcpath.length === 0){
      errors.hcpath = 'path should not be null';
      return errors;
    }
    else if(ahportoverride && this.state.item.touched.ahport && ahport.length === 0){
      errors.ahport = 'port should not be null';
      return errors;
    }
    else if(this.state.item.touched.ahhealthythreshold && ahhealthythreshold.length === 0){
      errors.ahhealthythreshold = 'healthy threshold should not be null';
      return errors;
    }
    else if(this.state.item.touched.ahuhealthythreshold && ahuhealthythreshold.length === 0){
      errors.ahuhealthythreshold = 'unhealthy threshold should not be null';
      return errors;
    }
    if(this.state.item.touched.ahtimeout && ahtimeout.length === 0){
      errors.ahtimeout = 'timeout should not be null';
      return errors;
    }
    if(this.state.item.touched.ahtinterval && ahtinterval.length === 0){
      errors.ahtinterval = 'interval should not be null';
      return errors;
    }
    if(this.state.item.touched.ahsucesscode && ahsucesscode.length === 0){
      errors.ahsucesscode = 'sucess code should not be null';
      return errors;
    }

    if(this.state.item.touched.deregistrationDelay && deregistrationDelay.length === 0){
      errors.deregistrationDelay = 'deregistrationDelay should not be null';
      return errors;
    }
    if(this.state.item.touched.shortStartDuration && shortStartDuration.length === 0){
      errors.shortStartDuration = 'shortStartDuration should not be null';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Target Group' : 'Add Target Group'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.protocole, item.port, item.type, item.hcprotocole, item.hcpath, item.ahport, item.ahhealthythreshold, 
      item.ahuhealthythreshold, item.ahtimeout, item.ahtinterval, item.ahsucesscode, item.ahportoverride, item.deregistrationDelay, item.shortStartDuration, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/targetgroups";

    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    
    let isLinkListener = (item.listener) ? true: false;

    const def = item.ahportoverride;
    const portover= (def) ? <FormGroup>
            <Label for="ahport">Port (*)</Label>
            <Input type="number" name="ahport" id="ahport" value={item.ahport || ''} placeholder="Enter Port"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahport')} autoComplete="ahport"
                   valid={errors.ahport === ''}
                   invalid={errors.ahport !== ''}
            />
           <FormFeedback>{errors.ahport}</FormFeedback>
          </FormGroup> : '';
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
         <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="accountId">Account (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optas}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="protocole">Protocole (*)</Label>
            <Input type="select" name="protocole" id="protocole" value={item.protocole || ''} disabled={isLinkListener}
                   onChange={this.handleChange} onBlur={this.handleBlur('protocole')} 
                   valid={errors.protocole === ''}
                   invalid={errors.protocole !== ''}
              >            
              <option value="" disabled>Choose</option>
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="TCP">TCP</option>
            </Input>
           <FormFeedback>{errors.protocole}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="port">Port (*)</Label>
            <Input type="number" name="port" id="port" value={item.port || ''} placeholder="Enter port" disabled={isLinkListener}
                   onChange={this.handleChange} onBlur={this.handleBlur('port')} autoComplete="port"
                   valid={errors.port === ''}
                   invalid={errors.port !== ''}
            />
           <FormFeedback>{errors.port}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="type">Target type (*)</Label>
            <Input type="select" name="type" id="type" value={item.type || ''} onChange={this.handleChange} onBlur={this.handleBlur('type')} 
                 valid={errors.type === ''}
                 invalid={errors.type !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="instance">Instance</option>
            </Input>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vpcId">Vpcs (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          <Label for="">Health check settings</Label>
          
          <FormGroup>
            <Label for="hcprotocole">Protocole (*)</Label>
            <Input type="select" name="hcprotocole" id="hcprotocole" value={item.hcprotocole || ''} 
                   onChange={this.handleChange} onBlur={this.handleBlur('hcprotocole')} 
                   valid={errors.hcprotocole === ''}
                   invalid={errors.hcprotocole !== ''}
                   >
              <option value="" disabled>Choose</option>
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
            </Input>
           <FormFeedback>{errors.hcprotocole}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="hcpath">Path (*)</Label>
            <Input type="text" name="hcpath" id="hcpath" value={item.hcpath || ''} placeholder="Enter Path"
                   onChange={this.handleChange} onBlur={this.handleBlur('hcpath')} autoComplete="hcpath"
                   valid={errors.hcpath === ''}
                   invalid={errors.hcpath !== ''}
            />
           <FormFeedback>{errors.hcpath}</FormFeedback>
          </FormGroup>



          <Label for="">Advanced health check settings</Label>


          <FormGroup tag="fieldset">
            <Label for="accessType">Port(*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="nooverride" checked={def === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                traffic port
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="override" checked={def === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                 override
              </Label>
            </FormGroup>
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>

          {portover}

          <FormGroup>
            <Label for="ahhealthythreshold">Healthy threshold (*)</Label>
            <Input type="number" name="ahhealthythreshold" id="ahhealthythreshold" value={item.ahhealthythreshold || ''} placeholder="Enter Healthy threshold"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahhealthythreshold')} autoComplete="ahhealthythreshold"
                   valid={errors.ahhealthythreshold === ''}
                   invalid={errors.ahhealthythreshold !== ''}
            />
           <FormFeedback>{errors.ahhealthythreshold}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ahuhealthythreshold">Unhealthy threshold (*)</Label>
            <Input type="number" name="ahuhealthythreshold" id="ahuhealthythreshold" value={item.ahuhealthythreshold || ''} placeholder="Enter Unhealthy threshold"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahuhealthythreshold')} autoComplete="ahuhealthythreshold"
                   valid={errors.ahuhealthythreshold === ''}
                   invalid={errors.ahuhealthythreshold !== ''}
            />
           <FormFeedback>{errors.ahuhealthythreshold}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ahtinterval">Interval (*)</Label>
            <Input type="number" name="ahtinterval" id="ahtinterval" value={item.ahtinterval || ''} placeholder="Enter Interval"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahtinterval')} autoComplete="ahtinterval"
                   valid={errors.ahtinterval === ''}
                   invalid={errors.ahtinterval !== ''}
            />
           <FormFeedback>{errors.ahtinterval}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ahtimeout">Timeout (*)</Label>
            <Input type="number" name="ahtimeout" id="ahtimeout" value={item.ahtimeout || ''} placeholder="Enter Timeout"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahtimeout')} autoComplete="ahtimeout"
                   valid={errors.ahtimeout === ''}
                   invalid={errors.ahtimeout !== ''}
            />
           <FormFeedback>{errors.ahtimeout}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="ahsucesscode">Sucess codes (*)</Label>
            <Input type="text" name="ahsucesscode" id="ahsucesscode" value={item.ahsucesscode || ''} placeholder="Enter Sucess code"
                   onChange={this.handleChange} onBlur={this.handleBlur('ahsucesscode')} autoComplete="ahsucesscode"
                   valid={errors.ahsucesscode === ''}
                   invalid={errors.ahsucesscode !== ''}
            />
           <FormFeedback>{errors.ahsucesscode}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="deregistrationDelay">deregistrationDelay (*)</Label>
            <Input type="number" name="deregistrationDelay" id="deregistrationDelay" value={item.deregistrationDelay || ''} placeholder="Enter deregistrationDelay"
                   onChange={this.handleChange} onBlur={this.handleBlur('deregistrationDelay')} autoComplete="deregistrationDelay"
                   valid={errors.deregistrationDelay === ''}
                   invalid={errors.deregistrationDelay !== ''}
            />
           <FormFeedback>{errors.deregistrationDelay}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="shortStartDuration">shortStartDuration (*)</Label>
            <Input type="number" name="shortStartDuration" id="shortStartDuration" value={item.shortStartDuration || ''} placeholder="Enter shortStartDuration"
                   onChange={this.handleChange} onBlur={this.handleBlur('shortStartDuration')} autoComplete="shortStartDuration"
                   valid={errors.shortStartDuration === ''}
                   invalid={errors.shortStartDuration !== ''}
            />
           <FormFeedback>{errors.shortStartDuration}</FormFeedback>
          </FormGroup>
          <FormGroup >
            <Label for="stickySession" >stickySession:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="stickySession" id="stickySession" 
                    onChange={this.handleChange} onBlur={this.handleBlur('stickySession')} 
                    checked={item.stickySession === true}/>
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

export default withRouter(TargetGroupEdit);