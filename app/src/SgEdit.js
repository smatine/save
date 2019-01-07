import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SgEdit extends Component {

  emptyItem = {
    name: '',
    nameTag: '',
    account: {},
    accounts: {},
    accountId : '',
    text: '',
	vpc: {},
    vpcs: {},
  	vpcId : '',
  	product: {},
  	products: {},
  	productId : '',
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      productId: false
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
      const sg = await (await fetch(`${API_BASE_URL}/sgs/${this.props.match.params.id}`)).json();
      sg.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        productId: false
      };
      this.setState({item: sg});
      
      await fetch(API_BASE_URL + '/accounts/' + (sg.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        
        this.setState({item: item});
      }); 

      let item = {...this.state.item};
      item.vpcId = sg.vpc.id;
      item.accountId = sg.account.id;
      item.productId = sg.product.id;
      item.products = sg.vpc.products;
      this.setState({item: item});
      
    }
    else {
      const sg = {
        name: '',
        accountId: false,
        nameTag: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
      	product: {},
      	products: {},
      	productId : '',
        touched: {
          name: false,
          vpcId: false,
          productId: false
        }
      };
      sg.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          productId: false
      };
      this.setState({item: sg});
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
      item.productId = '';
    }
    if(name === 'vpcId')
    {
       fetch(API_BASE_URL + '/vpcs/' + (item.vpcId),)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.products = jsonResult.products;
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
          productId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.accountId, item.productId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/sgs'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    item.product={id: item.productId};
    
    let lbs = [];
    if(item.lbs && item.lbs.length !== 0)
    {
      const sgLbs = item.lbs.map(lb => {
          lbs.push({id: lb.id});
      });
      item.lbs = lbs;
    }

    let rdss = [];
    if(item.rdss && item.rdss.length !== 0)
    {
      const sgRdss = item.rdss.map(rds => {
          rdss.push({id: rds.id});
      });
      item.rdss = rdss;
    }

    let eccs = [];
    if(item.eccs && item.eccs.length !== 0)
    {
      const sgEccs = item.eccs.map(ecc => {
          eccs.push({id: ecc.id});
      });
      item.eccs = eccs;
    }

    let elasticaches = [];
    if(item.elasticaches && item.elasticaches.length !== 0)
    {
      const sgElasticcachess = item.elasticaches.map(e => {
          elasticaches.push({id: e.id});
      });
      item.elasticaches = elasticaches;
    }

     let launchConfigurations = [];
    if(item.launchConfigurations && item.launchConfigurations.length !== 0)
    {
      const sglaunchConfigurations = item.launchConfigurations.map(e => {
          launchConfigurations.push({id: e.id});
      });
      item.launchConfigurations = launchConfigurations;
    }
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/sgs/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/sgs', {
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

  validate(name, vpcId, accountId, productId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      productId: ''
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
    else if(this.state.item.touched.productId && productId.length === 0){
        errors.productId = 'productId should not be null';
        return errors;
      }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit sg' : 'Add sg'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.accountId, item.productId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/sgs";

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
    
    const isLb = (item.lbs && item.lbs.length !== 0) ? true : false;

    let optps = [];
    if(item.products && item.products.length){
      item.products.map(s => {  
          optps.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let product = item.productId || '';
    item.productId = product;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="nameTag">Name tag (*)</Label>
            <Input type="text" name="nameTag" id="nameTag" value={item.nameTag || ''} placeholder="Enter nameTag"
                   onChange={this.handleChange} autoComplete="nameTag"
            />
          </FormGroup>

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
            <Input type="select" name="accountId" id="accountId"  value={account} onChange={this.handleChange} onBlur={this.handleBlur('accountId')} disabled={isLb}
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
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} disabled={isLb}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>
         
          <FormGroup>
          <Label for="productId">Products (*)</Label>
          <Input type="select" name="productId" id="productId"  value={product} onChange={this.handleChange} onBlur={this.handleBlur('productId')} disabled={isLb}
               valid={errors.productId === ''}
               invalid={errors.productId !== ''}
          >
            <option value="" disabled>Choose</option>
            {optps}
          </Input>
          <FormFeedback>{errors.productId}</FormFeedback>
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

export default withRouter(SgEdit);