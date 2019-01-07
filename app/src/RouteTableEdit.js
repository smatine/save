import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RouteTableEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    text: '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    def: false,
    subnets: [],
    subnetss: {},
    subnetId: [],
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      subnetId: false
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

      const routetable = await (await fetch(`${API_BASE_URL}/routeTables/${this.props.match.params.id}`)).json();
      routetable.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        subnetId: false
      };
      this.setState({item: routetable});
      
      await fetch(API_BASE_URL + '/accounts/' + (routetable.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      await (await fetch(API_BASE_URL + '/vpcs/' + (routetable.vpc.id) + '/subnets',)
        .then((result) => { 
          
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetss = jsonResult;
          
          this.setState({item: item});
      }));
      
      let item = {...this.state.item};
      item.vpcId = routetable.vpc.id;
      item.accountId = routetable.account.id;
      var values = [];
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });

      item.subnets = values;
      this.setState({item: item});
      
    }
    else {
      const routetable = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        def: false,
        subnets: [],
        subnetss: {},
        subnetId: [],
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          subnetId: false
        }
      };
      routetable.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          subnetId: false
      };
      this.setState({item: routetable});
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
      if(value === 'default'){
       //hide 
        item.def = true;
      }
      else
      {
        //show
        item.def = false;
      }
    }
    
    if(name === 'subnetId')
    {
      var options = event.target.options;
      var values = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            if(item.subnetss && item.subnetss.length){
                item.subnetss.map(s => { 
                  if(s.id == options[i].value) {
                      values.push({"id": s.id});
                  }
              });
            }
        }
      }
      item.subnets = values;
      this.setState({item});
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

      item.subnetId = '';
      item.subnets = [];
      item.subnetss = [];
    }
    if(name === 'vpcId')
    {
      
        fetch(API_BASE_URL + '/vpcs/' + (item.vpcId) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.subnetss = jsonResult;
          this.setState({item: item});
        });
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          accountId: true,
          vpcId: true,
          subnetId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/routetables'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    
    //console.log("sma" + item.subnetgroupId);
    //return;
    /*if(item.subnets && item.subnets.length) item.subnets.map(s => {  
          //alert("subnet:" + s.id + " " + item.subnets.length);
    });*/

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/routeTables/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/routeTables', {
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

  validate(name, vpcId, subnetId, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      subnetId: ''
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
    
    if(this.state.item.touched.subnetId && subnetId && this.state.item.subnets.length === 0){
      errors.subnetId = 'Add subnets to cover at least 2 availability zones.';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Route Table' : 'Add Route Table'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/routetables";

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
          opts.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    const def = item.def;

    let optss = [];
    if(item.subnetss && item.subnetss.length){
      item.subnetss.map(s => {
      
          let isSelected = false;
          if(item.subnets && item.subnets.length) item.subnets.map(ss => {
             if(s.id == ss.id) isSelected = true;
          });
          optss.push(<option key={s.id} value={s.id} selected={isSelected}>{s.id} {s.name} {s.az.name}</option>);
      });
    }
    let sub = item.subnetId || {};
    item.subnetId = sub;

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

          <FormGroup>
            <Label for="subnetId">Subnets (*)</Label>
            <Input type="select" name="subnetId" id="subnetId"   onChange={this.handleChange} onBlur={this.handleBlur('subnetId')} multiple
                 valid={errors.subnetId === ''}
                 invalid={errors.subnetId !== ''}
            >
            <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.subnetId}</FormFeedback>
          </FormGroup>
         
         <FormGroup tag="fieldset">
            <Label for="accessType">Main (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="default" checked={def === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="nodefault" checked={def === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
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

export default withRouter(RouteTableEdit);