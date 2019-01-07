import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class DhcpEdit extends Component {

  emptyItem = {
    name: '',
    account: {},
    accounts: {},
    accountId : '',
    domainName: '',
    domainNameServers: '',
    ntpServers: '',
    netBiosNameServers: '',
    netBiosNodeType: '',
    vpc: {},
    vpcs: {},
    vpcId : '',
    touched: {
      name: false,
      accountId: false,
      vpcId: false,
      domainName: false,
      domainNameServers: false
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
      const dhcp = await (await fetch(`${API_BASE_URL}/dhcps/${this.props.match.params.id}`)).json();
      dhcp.touched = {
        name: false,
        accountId: false,
        vpcId: false,
        domainName: false,
        domainNameServers: false,
      };
      this.setState({item: dhcp});

      await fetch(API_BASE_URL + '/accounts/' + (dhcp.account.id) + '/vpcs',)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        let item = {...this.state.item};
        item.vpcs = jsonResult;
        this.setState({item: item});
      });

      let item = {...this.state.item};
      item.vpcId = dhcp.vpc.id;
      item.accountId = dhcp.account.id;
      this.setState({item: item});
      
    }
    else {
      const dhcp = {
        name: '',
        account: {},
        accounts: {},
        accountId : '',
        domainName: '',
        domainNameServers: '',
        ntpServers: '',
        netBiosNameServers: '',
        netBiosNodeType: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        touched: {
          name: false,
          accountId: false,
          vpcId: false,
          domainName: false,
          domainNameServers: false,
        }
      };
      dhcp.touched = {
          name: false,
          accountId: false,
          vpcId: false,
          domainName: false,
          domainNameServers: false,
      };
      this.setState({item: dhcp});
    }
    
    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.accounts = jsonResult;
      this.setState({item: item});
    });

    /*await fetch('/vpcs',)
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
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          accountId: false,
          vpcId: true,
          domainName: true,
          domainNameServers: true
    };
    const errors = this.validate(item.name, item.vpcId, item.domainName, item.domainNameServers, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/dhcps'; 

    item.vpc={id: item.vpcId};
    item.account={id: item.accountId};
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? API_BASE_URL + '/vpcs/' + (item.vpc.id) + '/dhcps/'+(item.id) : API_BASE_URL + '/vpcs/' + item.vpc.id + '/dhcps', {
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

  validate(name, vpcId, domainName, domainNameServers, accountId) {

    const errors = {
      name: '' ,
      accountId: '',
      vpcId: '',
      domainName: '', 
      domainNameServers: ''
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
    else if(this.state.item.touched.domainName && domainName.length === 0){
      errors.domainName = 'domainName should not be null';
      return errors;
    }
    else if(this.state.item.touched.domainNameServers && domainNameServers.length === 0){
      errors.domainNameServers = 'domainNameServers should not be null';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Dhcp Options Sets' : 'Add Dhcp Options Sets'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.domainName, item.domainNameServers, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/dhcps";

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
    let tri = item.vpcId || '';
    item.vpcId = tri;


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
            <Label for="domainName">Domain Name (*)</Label>
            <Input type="text" name="domainName" id="domainName" value={item.domainName || ''} placeholder="Enter domainName"
                   onChange={this.handleChange} onBlur={this.handleBlur('domainName')} autoComplete="domainName"
                   valid={errors.domainName === ''}
                   invalid={errors.domainName !== ''}
            />
           <FormFeedback>{errors.domainName}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="domainNameServers">Domain Name Servers (*)</Label>
            <Input type="text" name="domainNameServers" id="domainNameServers" value={item.domainNameServers || ''} placeholder="Enter domainNameServers"
                   onChange={this.handleChange} onBlur={this.handleBlur('domainNameServers')} autoComplete="domainNameServers"
                   valid={errors.domainNameServers === ''}
                   invalid={errors.domainNameServers !== ''}
            />
           <FormFeedback>{errors.domainNameServers}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="ntpServers">Ntp Servers</Label>
            <Input type="text" name="ntpServers" id="ntpServers" value={item.ntpServers || ''} placeholder="Enter ntpServers"
                   onChange={this.handleChange} onBlur={this.handleBlur('ntpServers')} autoComplete="ntpServers"
            />
          </FormGroup>
          <FormGroup>
            <Label for="netBiosNameServers">NetBios Name Servers</Label>
            <Input type="text" name="netBiosNameServers" id="netBiosNameServers" value={item.netBiosNameServers || ''} placeholder="Enter netBiosNameServers"
                   onChange={this.handleChange} onBlur={this.handleBlur('netBiosNameServers')} autoComplete="netBiosNameServers"
            />
          </FormGroup>
          <FormGroup>
            <Label for="netBiosNodeType">NetBios Node Type</Label>
            <Input type="text" name="netBiosNodeType" id="netBiosNodeType" value={item.netBiosNodeType || ''} placeholder="Enter netBiosNodeType"
                   onChange={this.handleChange} onBlur={this.handleBlur('netBiosNodeType')} autoComplete="netBiosNodeType"
            />
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

export default withRouter(DhcpEdit);