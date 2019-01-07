import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class PeeringEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    text: '',
    type:'',
    owner: '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    peeringAccepterExternal: {},
    peeringAccepterInternal: {},
    region: {},
    regions:[],
    regionId:'',
    vpc2: {},
    vpc2s: {},
    vpc2Id : '',
    vpceId: '',
    touched: {
      name: false,
      vpcId: false,
      type: false,
      regionId: false,
      owner: false,
      vpc2Id: false,
      vpceId: false
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

      const peering = await (await fetch(`${API_BASE_URL}/peerings/${this.props.match.params.id}`)).json();
      peering.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        type:false,
        regionId: false,
        owner: false,
        vpc2Id: false,
        vpceId: false
      };
      this.setState({item: peering});

      await fetch(API_BASE_URL + '/accounts/' + (peering.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      let item = {...this.state.item};


      item.vpcId = peering.vpc.id;
      item.accountId = peering.account.id;

      if(peering.type === 'External')
      {
        //item.peeringAccepterExternalId = peering.peeringAccepterExternalId.id;
        item.regionId = peering.peeringAccepterExternal.region.id;
        item.vpceId = peering.peeringAccepterExternal.vpcId;
        item.owner = peering.peeringAccepterExternal.owner;
        
      }
      else
      {
        await await(fetch(API_BASE_URL + '/accounts/' + (peering.peeringAccepterInternal.vpc.account.id) + '/vpcs',)
        .then((result) => {
          //console.log('change2');
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.vpc2s = jsonResult;
          this.setState({item: item});
        }));

        //item.peeringAccepterInternalId = peering.peeringAccepterInternalId.id;
        item.regionId = peering.peeringAccepterInternal.vpc.cidr.region.id;
        item.vpc2Id = peering.peeringAccepterInternal.vpc.id;
        
      }
      this.setState({item: item});
      
    }
    else {
      const peering = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        text: '',
        type:'',
        vpc: {},
        vpcs: {},
        vpcId : '',
        owner:'',
        peeringAccepterExternal: {},
        peeringAccepterInternal: {},
        region: {},
        regionId:'',
        vpc2: {},
        vpc2s: {},
        vpc2Id : '',
        vpceId: '',
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          type:false,
          regionId: false,
          owner: false,
          vpc2Id: false,
          vpceId: false
        }
      };
      peering.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          type:false,
          regionId: false,
          owner: false,
          vpc2Id: false,
          vpceId: false
      };
      peering.type = 'External';
      this.setState({item: peering});
    }

    /*await fetch('/vpcs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    });*/
    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });

    await fetch(API_BASE_URL + '/regions',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.regions = jsonResult;
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

      item.vpc2Id = '';
      item.vpc2s = [];
    }

    if(name === 'vpcId')
    {

      fetch(API_BASE_URL + '/vpcs/' + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        
        let vp = jsonResult;
        fetch(API_BASE_URL + '/accounts/' + (vp.account.id) + '/vpcs',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          item.vpc2s = jsonResult;
          this.setState({item: item});
        });

      });
    }
    if(name === 'type' && value === 'Internal')
    {
      fetch(API_BASE_URL + '/vpcs/' + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        
        let vp = jsonResult;
        
        if(vp.account)
        {
          fetch(API_BASE_URL + '/accounts/' + (vp.account.id) + '/vpcs',)
          .then((result) => {
            return result.json();
          }).then((jsonResult) => {
            item.vpc2s = jsonResult;
            this.setState({item: item});
          });
        }

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
          type: true,
          regionId: true,
          owner: true,
          vpc2Id: true,
          vpceId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.type, item.regionId, item.owner, item.vpc2Id, item.vpceId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/peerings'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    
    if(item.type === 'External')
    {
      item.peeringAccepterExternal = {"owner": item.owner, "vpcId": item.vpceId};
      item.peeringAccepterExternal.region = {"id": item.regionId};
      item.peeringAccepterInternal = null;
    }
    else
    {
      item.peeringAccepterInternal = {};
      //console.log('vpc2=' + item.vpc2Id);
      item.peeringAccepterInternal.vpc = {"id": item.vpc2Id};
      item.peeringAccepterExternal = null;

    }

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/peerings/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/peerings', {
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

  validate(name, vpcId, type, regionId, owner, vpc2Id, vpceId, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      vpc2Id: '',
      type: '',
      regionId: '',
      owner: '',
      vpceId: ''
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
      errors.vpcId = 'Vpc Requester should not be null';
      return errors;
    }
    else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }
  
    if(type === 'Internal')
    {
      if(this.state.item.touched.vpc2Id && (!vpc2Id || vpc2Id.length === 0)){
        errors.vpc2Id = 'Vpc Accepter should not be null';
        return errors;
      }
    }
    else
    {
      if(this.state.item.touched.vpceId && (!vpceId  || vpceId.length === 0)){
        errors.vpceId = 'Vpc Accepter should not be null';
        return errors;
      }
      else if(this.state.item.touched.regionId && (!regionId  || regionId.length === 0)){
        errors.regionId = 'region should not be null';
        return errors;
      }
      else if(this.state.item.touched.owner && (!owner  || owner.length === 0)){
        errors.owner = 'owner should not be null';
        return errors;
      }
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Peering' : 'Add Peering'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.type, item.regionId, item.owner, item.vpc2Id, item.vpceId, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/peerings";
    const def = (item.type === 'External') ? true : false;
    const modif = (item.id) ? true : false;

    let optas = [];
    if(item.accounts && item.accounts.length){
      item.accounts.map(s => {  
          optas.push(<option key={s.id} value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let account = item.accountId || '';
    item.accountId = account;

    let optsr = [];
    if(item.regions && item.regions.length){
          item.regions.map(s => {  
          optsr.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let reg = item.regionId || '';
    item.regionId = reg;
  
    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    
//
    let optss = [];
    if(item.vpc2s && item.vpc2s.length){
      item.vpc2s.map(s => {    
          let isSelected = false;
          /*if(item.subnets && item.subnets.length) item.subnets.map(ss => {
             if(s.id == ss.id) isSelected = true;
          }); selected={isSelected}*/
          optss.push(<option key={s.id} value={s.id} >{s.id} {s.name}</option>);
      });
    }
    let vpc2 = item.vpc2Id || ''; 
    item.vpc2Id = vpc2;

    const rregion = (item.type === 'External') ? <FormGroup>
            <Label for="regionId">Region (*)</Label>
            <Input type="select" name="regionId" id="regionId"  value={reg} onChange={this.handleChange} onBlur={this.handleBlur('regionId')}
                 valid={errors.regionId === ''}
                 invalid={errors.regionId !== ''}>
              <option value="" disabled>Choose</option>
              {optsr}
            </Input>
            <FormFeedback>{errors.regionId}</FormFeedback>
          </FormGroup> : '';
    const rowner = (item.type === 'External') ? <FormGroup>
            <Label for="owner">Owner (*)</Label>
            <Input type="text" name="owner" id="owner" value={item.owner || ''} placeholder="Enter owner"
                   onChange={this.handleChange} onBlur={this.handleBlur('owner')} autoComplete="owner"
                   valid={errors.owner === ''}
                   invalid={errors.owner !== ''}/>
           <FormFeedback>{errors.owner}</FormFeedback>
           </FormGroup> : '';
    const rvpc = (item.type === 'External') ? <FormGroup>
            <Label for="vpceId">VPC Accepter (*)</Label>
            <Input type="text" name="vpceId" id="vpceId" value={item.vpceId || ''} placeholder="Enter Vpc"
                   onChange={this.handleChange} onBlur={this.handleBlur('vpceId')} autoComplete="vpceId"
                   valid={errors.vpceId === ''}
                   invalid={errors.vpceId !== ''}/>
           <FormFeedback>{errors.vpceId}</FormFeedback>
          </FormGroup> : '';
  
   const rvpc2 = (item.type === 'Internal') ? <FormGroup>
            <Label for="vpc2Id">VPC Accepter (*)</Label>
            <Input type="select" name="vpc2Id" id="vpc2Id"   value={vpc2} onChange={this.handleChange} onBlur={this.handleBlur('vpc2Id')}
                 valid={errors.vpc2Id === ''}
                 invalid={errors.vpc2Id !== ''}
            >
            <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.vpc2Id}</FormFeedback>
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


         <FormGroup tag="fieldset">
            <Label for="type">External/ Internal (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="type" id="type" value="External" checked={def === true} disabled = {modif}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                External
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="type" id="type" value="Internal" checked={def === false} disabled = {modif}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                Internal
              </Label>
              </FormGroup>
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>

          {rregion} {rowner} {rvpc}

          {rvpc2} 

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

export default withRouter(PeeringEdit);