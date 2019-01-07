import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ElasticCacheEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
    account: {},
    accounts: {},
    accountId : '',
    vpc: {},
    vpcs: {},
    vpcId : '',
    subnetgroup: {},
    subnetgroups: {},
    subnetgroupId : '',
    sgss: {},
    sgs: [],
    sgId: [],
    touched: {
      name: false,
      vpcId: false,
      subnetgroupId: false,
      accountId: false,
      sgId: false
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
      const elasticCache = await (await fetch(`${API_BASE_URL}/elasticCaches/${this.props.match.params.id}`)).json();
      elasticCache.touched = {
        name: false,
        vpcId: false,
        subnetgroupId: false,
        accountId: false,
        sgId: false
      };
      this.setState({item: elasticCache});
      
      fetch(API_BASE_URL + '/vpcs/' + (elasticCache.vpc.id) + '/type/ECC' + '/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetgroups = jsonResult;
          this.setState({item: item});
      });
      await fetch(API_BASE_URL + '/accounts/' + (elasticCache.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });
      
      
      fetch(API_BASE_URL + '/vpcs/' + (elasticCache.vpc.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
      });


      let item = {...this.state.item};
      item.accountId = elasticCache.account.id;
      item.vpcId = elasticCache.vpc.id;
      item.subnetgroupId = elasticCache.subnetgroup.id;

      var values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;

      this.setState({item: item});
      
    }
    else {
      const elasticCache = {
        name: '',
        text: '',
        account: {},
        accounts: {},
        accountId : '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnetgroup: {},
        subnetgroups: {},
        subnetgroupId : '',
        sgss: {},
        sgs: [],
        sgId: [],
        touched: {
          name: false,
          vpcId: false,
          subnetgroupId: false,
          accountId: false,
          sgId: false
        }
      };
      elasticCache.touched = {
          name: false,
          vpcId: false,
          subnetgroupId: false,
          accountId: false,
          sgId: false
      };
      this.setState({item: elasticCache});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
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
      item.subnetgroupId = '';
      item.subnetgroups = [];
      item.sgId = '';
      item.sgss = [];
    }

    if(name === 'vpcId')
    {
      
      fetch(API_BASE_URL + '/vpcs/' + item.vpcId + '/type/ECC' + '/subnetGroups',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        item.subnetgroups = jsonResult;
        this.setState({item: item});
      });

      fetch(API_BASE_URL + '/vpcs/' + item.vpcId + '/sgs',)
      .then((result) => { 
        return result.json();
      }).then((jsonResult) => {
        item.sgss = jsonResult;
        this.setState({item: item});
      });
      
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          vpcId: true,
          subnetgroupId: true,
          accountId: false,
          sgId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.accountId, item.sgId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/elasticCaches'; 

    item.account={id: item.accountId};
    item.vpc={id: item.vpcId};
    item.subnetgroup={id: item.subnetgroupId};

    var values = [];
    if(item.sgs && item.sgs.length){
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sg= values;
    }

    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/elasticCaches/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/elasticCaches', {
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

  validate(name, vpcId, subnetgroupId, accountId, sgId) {

    const errors = {
      name: '' ,
      vpcId: '',
      subnetgroupId: '',
      accountId: '',
      sgId: ''
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
    else if(this.state.item.touched.subnetgroupId && subnetgroupId.length === 0){
      errors.subnetgroupId = 'Subnet group should not be null';
      return errors;
    }
    else if(this.state.item.touched.sgId && sgId && this.state.item.sgs.length <= 0){
      errors.sgId = 'sgId should not be null';
      return errors;
    }
    return errors;
  }

  onOptionChange = (selectName,selectedOption) => {
      const {item} = this.state;
      var options = selectedOption;
      var values = [];
      if(selectName === 'sgId')
      {
        for (var i = 0, l = options.length; i < l; i++) {      
          if(item.sgss && item.sgss.length){
              item.sgss.map(s => { 
                if(s.id == options[i].value) {
                    values.push({"id": s.id});
                }
            });
          }
        }
        item.sgs = values;
      }
      this.setState({item});
  };

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit elasticCache' : 'Add elasticCache'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/elasticCaches";

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
    let tri = item.vpcId || '';
    item.vpcId = tri;


    let optss = [];
    if(item.subnetgroups && item.subnetgroups.length){
      item.subnetgroups.map(s => {  
          optss.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let sg = item.subnetgroupId || '';
    item.subnetgroupId = sg;

    let optsg = [];  
    let optsgs = [];
    if(item.sgss && item.sgss.length){
      item.sgss.map(s => {  
          if(item.sgs && item.sgs.length) item.sgs.map(ss => {
             if(s.id == ss.id) {
               optsgs.push({value: s.id, label: s.name});
             }
          });
          optsg.push({value: s.id, label: s.name});
      });
    }
    const securityGroup = <FormGroup>
            <Label for="sgId">Security Group (*)</Label>
            <Select name="sgId" id="sgId"  placeholder="Enter Security group" isMulti isSearchable
              value={optsgs}
              onChange={e => this.onOptionChange("sgId",e)}
              onBlur={this.handleBlur('sgId')}
              options={optsg}
            />
            <FormFeedback>{errors.sgId}</FormFeedback>
          </FormGroup>;


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
            <Input type="select" name="vpcId" id="vpcId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>
         
         <FormGroup>
            <Label for="subnetgroupId">Subnet group (*)</Label>
            <Input type="select" name="subnetgroupId" id="subnetgroupId"  value={sg} onChange={this.handleChange} onBlur={this.handleBlur('subnetgroupId')}
                 valid={errors.subnetgroupId === ''}
                 invalid={errors.subnetgroupId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.subnetgroupId}</FormFeedback>
          </FormGroup>

          {securityGroup}

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

export default withRouter(ElasticCacheEdit);