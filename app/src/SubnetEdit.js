import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SubnetEdit extends Component {

  emptyItem = {
    text: '',
	  vpc: {},
    vpcs:{},
    type:'',
    sCidr: {},
    sCidrs: {},
  	vpcId : '',
    subnetCidrId: '',
    isSameVpc: true,
    az:{},
    azs:{},
    azId: '',
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    subnetgroup: [],
    productss: {},
    products: [],
    productId: [],
    touched: {
      type: false,
      vpcId: false,
      subnetCidrId: false,
      name: false,
      accountId: false,
      azId: false,
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
      const subnet = await (await fetch(`${API_BASE_URL}/subnets/${this.props.match.params.id}`)).json();
      subnet.touched = {
        type: false,
        vpcId: false,
        subnetCidrId: false,
        name: false,
        accountId: false,
        azId: false,
        productId: false
      };
      this.setState({item: subnet});
      let item = {...this.state.item};

      await fetch(API_BASE_URL + '/accounts/' + (subnet.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        //let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      //attention
      await (await fetch(API_BASE_URL + '/cidrs/' + (subnet.vpc.cidr.id) + '/subnetcidrs/0',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          item.sCidrs = jsonResult;
          this.setState({item: item});
        }));
      
      await (await fetch(API_BASE_URL + '/regions/' + (subnet.vpc.cidr.region.id) + '/azs',)
        //fetch('/regions/1001/azs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          
          item.azs = jsonResult;
          this.setState({item: item});
      }));

      var values = [];
      item.products.map(s => { 
        values.push({"id": s.id});
      });
      item.products = values;
      item.productss = subnet.vpc.products;
      
      item.isSameVpc = true;
      item.subnetCidrId = subnet.sCidr.id;
      item.vpcId = subnet.vpc.id;
      item.accountId = subnet.account.id;
      item.azId = subnet.az.id;
      this.setState({item: item});
    }
    else {
      //const vpc = await (await fetch(`/vpcs/${this.props.match.params.idv}`)).json();
      const subnet = {
        text: '',
        type: '',
        vpc: {},
        vpcs:{},
        sCidr: {},
        sCidrs: {},
        vpcId : '',
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        subnetCidrId: '',
        isSameVpc: true,
        az:{},
        azs:{},
        azId: '',
        subnetgroup: [],
        productss: {},
        products: [],
        productId: [],
        touched: {
          type: false,
          vpcId: false,
          subnetCidrId: false,
          name: false,
          accountId: false,
          azId: false,
          productId: false
        }
      };
      //subnet.vpc = vpc;
      subnet.touched = {
        type: false,
        vpcId: false,
        subnetCidrId: false,
        name: false,
        accountId: false,
        azId: false,
        productId: false
      };
      this.setState({item: subnet});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });
    //const {item} = this.state;
    /*await fetch('/vpcs',)
    .then((result) => { 
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    }); */ 
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
      
      item.subnetCidrId = '';
      //item.sCidr = {};
      item.sCidrs = [];

      item.azId = '';
      item.az = {};
      item.azs = [];
      
      item.products = [];
      item.productId = '';
      item.products = [];
    }

    item.isSameVpc = true;
    if(name === 'vpcId')
    {
      //console.log('change' + item.vpcId);
      let vp={};
      item.products = [];
      fetch(API_BASE_URL + "/vpcs/" + item.vpcId,)
      .then((result) => {
        //console.log('change1');
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        item.productss = vp.products;
        //memevpc
        if(item.id && item.sCidr.subnet && item.sCidr.subnet.vpc.id !== vp.id) item.isSameVpc = false;

        fetch(API_BASE_URL + '/cidrs/' + (vp.cidr.id) + '/subnetcidrs/0',)
        .then((result) => {
          //console.log('change2=' + item.sCidr.id);
          return result.json();
        }).then((jsonResult) => {
          item.sCidrs = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/regions/' + (vp.cidr.region.id) + '/azs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.azs = jsonResult;
          this.setState({item: item});
        });

      });
      item.productId = '';
      item.products = [];
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
        type: true,
        vpcId: true,
        subnetCidrId: true,
        name: true,
        accountId: true,
        azId: true,
        productId: true
    };
    const errors = this.validate(item.subnetCidrId, item.vpcId, item.type, item.name, item.azId, item.accountId, item.productId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/vpc/' + item.vpc.id + '/subnets';

    item.sCidr={id: item.subnetCidrId};//modif subnetCidr

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};

    item.az={id: item.azId};
    
    var values = [];
    //item.subnetgroup=[];
    if(item.subnetgroup && item.subnetgroup.length){
      //console.log('item.subnetgroup.length=' + item.subnetgroup.length);
      item.subnetgroup.map(s => { 
        values.push({"id": s.id});
      });
      item.subnetgroup= values;
    }
    
    values=[];
    if(item.nacls && item.nacls.length){
      item.nacls.map(s => { 
        values.push({"id": s.id});
      });
      item.nacls= values;
    }

    values=[];
    if(item.routetables && item.routetables.length){
      item.routetables.map(s => { 
        values.push({"id": s.id});
      });
      item.routetables= values;
    }
    
    values=[];
    if(item.lbs && item.lbs.length){
      item.lbs.map(s => { 
        values.push({"id": s.id});
      });
      item.lbs = values;
    }

    values=[];
    if(item.autoScalingGroups && item.autoScalingGroups.length){
      item.autoScalingGroups.map(s => { 
        values.push({"id": s.id});
      });
      item.autoScalingGroups = values;
    }
    var values = [];
    if(item.products && item.products.length){
      item.products.map(p => { 
        values.push({"id": p.id});
      });
      item.products= values;
    }
    //alert(item.sCidr.id + "  " + item.vpc.id + "  " + item.az.id);

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/subnets/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/subnets', {
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

  validate(subnetCidrId, vpcId, type, name, azId, accountId, productId) {

    const errors = {
      type: '',
      vpcId: '',
      subnetCidrId: '',
      name: '',
      accountId: '',
      azId: '',
      productId: ''
    };
    
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'accountId should not be null';
      return errors;
    }

    if(this.state.item.touched.subnetCidrId && subnetCidrId.length === 0){
      errors.subnetCidrId = 'subnetCidr should not be null';
      return errors;
    }
    
    if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    
    if(this.state.item.touched.productId && this.state.item.products.length <= 0){
        errors.productId = 'productId should not be null';
        return errors;
    }
    
    if(this.state.item.touched.azId && azId.length === 0){
      errors.azId = 'Az should not be null';
      return errors;
    }
    
    return errors;
  }

  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'productId')
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.productss && item.productss.length){
              item.productss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.products = values;
      }
      this.setState({item});
  };
  
  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Subnet' : 'Add Subnet'}</h2>;
    
    const errors = this.validate(item.subnetCidrId, item.vpcId, item.type, item.name, item.azId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/vpc/" + item.vpc.id + "/subnets";


    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let opts = [];
    if(item.sCidrs && item.sCidrs.length){
          item.sCidrs.map(s => {  
          opts.push(<option key={s.id} value={s.id}>{s.id} {s.subnetCidr}</option>);
      });
    }
    if(item.id && item.isSameVpc) {
          opts.push(<option key={item.sCidr.id} value={item.sCidr.id} >{item.sCidr.id} {item.sCidr.subnetCidr} </option>);
    }

    let cid = item.subnetCidrId || '';
    item.subnetCidrId = cid;

   let optsv = [];
    if(item.vpcs && item.vpcs.length){
          item.vpcs.map(s => {  
          optsv.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    if(item.id) {
          //optsv.push(<option value={item.vpc.id} >{item.vpc.id} {item.vpc.name} </option>);
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;

    let optsa = [];
    if(item.azs && item.azs.length){
          item.azs.map(s => {  
          optsa.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let az = item.azId || '';
    item.azId = az;

    let optproduct = [];  
    let optproducts = [];
    if(item.productss && item.productss.length){
      item.productss.map(s => {  
          if(item.products && item.products.length) item.products.map(ss => {
             if(s.id == ss.id) {
               optproducts.push({value: s.id, label: s.name});
             }
          });
          optproduct.push({value: s.id, label: s.name});
      });
    }
    const prs = <FormGroup>
            <Label for="productId">Products (*)</Label>
            <Select name="productId" id="productId"  placeholder="Enter products" isMulti isSearchable
              value={optproducts}
              onChange={e => this.onOptionChange("productId",e)}
              onBlur={this.handleBlur('productId')}
              options={optproduct}
            />
            <FormFeedback>{errors.productId}</FormFeedback>
          </FormGroup>;
          
    return <div>
      <AppNavbar/>
      <Container>
        {title}

        <Form onSubmit={this.handleSubmit}>

          
         
         <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
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
            <Label for="vpcId">Vpc (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsv}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>
      
          {prs} 
          
          <FormGroup>
            <Label for="subnetCidrId">CIDR (*)</Label>
            <Input type="select" name="subnetCidrId" id="subnetCidrId"  value={cid} onChange={this.handleChange} onBlur={this.handleBlur('subnetCidrId')}
                 valid={errors.subnetCidrId === ''}
                 invalid={errors.subnetCidrId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.subnetCidrId}</FormFeedback>
          </FormGroup>
          
          
          <FormGroup>
            <Label for="type">Type(*)</Label>
            <Input type="text" name="type" id="type" value={item.type || ''}
                   onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                    valid={errors.type === ''}
                   invalid={errors.type !== ''}
            />
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>
		  
		     <FormGroup>
            <Label for="azId">Az (*)</Label>
            <Input type="select" name="azId" id="azId"  value={az} onChange={this.handleChange} onBlur={this.handleBlur('azId')}
                 valid={errors.azId === ''}
                 invalid={errors.azId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsa}
            </Input>
            <FormFeedback>{errors.azId}</FormFeedback>
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

export default withRouter(SubnetEdit);