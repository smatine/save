import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
//const cidrRegex = require('cidr-regex');
var ipaddr = require('ipaddr.js');
class EccNetworkInterfaceEdit extends Component {

  emptyItem = {
    device: '',
    networkInterface: '',
    primaryIp: '',
    secondaryIp: '',
    ipv6Ips: '', 
    ecc: {},
    subnet: {},
    touched: {
      device:false,
      networkInterface: false,
      primaryIp: false,
      secondaryIp:false,
      ipv6Ips:false
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
      const eccNetworkInterface = await (await fetch(`${API_BASE_URL}/eccNetworkInterfaces/${this.props.match.params.id}`)).json();
      eccNetworkInterface.touched = {
        device:false,
        networkInterface: false,
        primaryIp: false,
        secondaryIp:false,
        ipv6Ips:false
      };
      this.setState({item: eccNetworkInterface});
      let item = {...this.state.item};
      item.subnet = eccNetworkInterface.ecc.subnet;
      //console.log('subnet');
      //if(eccNetworkInterface.ecc.subnet) console.log('subnet=' + eccNetworkInterface.ecc.subnet.id + ' ' +eccNetworkInterface.ecc.subnet.name);
      this.setState({item: item});
      

    }
    else {
      const ecc = await (await fetch(`${API_BASE_URL}/eccs/${this.props.match.params.ide}`)).json();
      const eccNetworkInterface = {
        device: '',
        networkInterface: '',
        primaryIp: '',
        secondaryIp: '',
        ipv6Ips: '', 
        ecc: {},
        subnet:{},
        touched: {
          device:false,
          networkInterface: false,
          primaryIp: false,
          secondaryIp:false,
          ipv6Ips:false
        }
      };
      eccNetworkInterface.ecc = ecc;

      eccNetworkInterface.touched = {
          device:false,
          networkInterface: false,
          primaryIp: false,
          secondaryIp:false,
          ipv6Ips:false
      };
      this.setState({item: eccNetworkInterface});
      let item = {...this.state.item};
      item.subnet = ecc.subnet;
      this.setState({item: item});
    }


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
      device:true,
      networkInterface: true,
      primaryIp: true,
      secondaryIp:true,
      ipv6Ips:true
    };
    const errors = this.validate(item.device, item.networkInterface, item.primaryIp, item.secondaryIp, item.ipv6Ips, item.subnet);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/ecc/' + item.ecc.id +'/eccNetworkInterfaces'; 

    item.ecc={id: item.ecc.id};
    
    //return;

    await fetch((item.id) ? API_BASE_URL + '/eccs/' + (item.ecc.id) + '/eccNetworkInterfaces/'+(item.id) : API_BASE_URL + '/eccs/' + item.ecc.id + '/eccNetworkInterfaces', {
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

  validate(device, networkInterface, primaryIp, secondaryIp, ipv6Ips, subnet) {

    const errors = { 
      device: '',
      networkInterface: '',
      primaryIp: '',
      secondaryIp:'', 
      ipv6Ips:''
    };
    var sub = '';
    var iprange = '';
    var ip = '';
    if(subnet && subnet.sCidr) 
    {
      sub = subnet.sCidr.subnetCidr.split("/");
      iprange = sub[1];
      ip = sub[0];
    }
    
    if(this.state.item.touched.device && device.length === 0){
      errors.device = 'device should not be null';
      return errors;
    }
    if(this.state.item.touched.networkInterface && networkInterface.length === 0){
      errors.networkInterface = 'networkInterface should not be null';
      return errors;
    }
    if(this.state.item.touched.primaryIp && primaryIp.length !== 0 && !ipaddr.isValid(primaryIp) && sub  ){
      errors.primaryIp = 'primaryIp should have Ip format';
      return errors;
    }
    
    if(this.state.item.touched.primaryIp && primaryIp.length !== 0 && ipaddr.isValid(primaryIp) && sub  ){

      var addr = ipaddr.parse(primaryIp);
      var range = ipaddr.parse(ip);
      if(!addr.match(range, iprange))
      {
        errors.primaryIp = 'primaryIp should be in subnet cidr';
        return errors;
      }
    }
    if(this.state.item.touched.secondaryIp && secondaryIp.length !== 0 && !ipaddr.isValid(secondaryIp) && sub ){
      errors.secondaryIp = 'secondaryIp should have Ip format';
      return errors;
    }
    if(this.state.item.touched.secondaryIp && secondaryIp.length !== 0 && ipaddr.isValid(secondaryIp) && sub  ){
      console.log('secondaryIp=' + secondaryIp);
      var addr = ipaddr.parse(secondaryIp);
      var range = ipaddr.parse(ip);
      if(!addr.match(range, iprange))
      {
        
        errors.secondaryIp = 'secondaryIp should be in subnet cidr';
        return errors;
      }
    }
    if(this.state.item.touched.secondaryIp && secondaryIp.length !== 0 && sub  &&
      this.state.item.touched.primaryIp && primaryIp.length !== 0 && primaryIp === secondaryIp){
      errors.secondaryIp = 'secondaryIp should be in different to secondaryIp';
      return errors;
    }
    if(this.state.item.touched.ipv6Ips && ipv6Ips.length !== 0 && ipaddr.isValid(ipv6Ips)){
      errors.ipv6Ips = 'ipv6Ips should have Ip format';
      return errors;
    }
    // verfication des ip

    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Ec2 NetworkInterface' : 'Add Ec2 NetworkInterface'}</h2>;

    const errors = this.validate(item.device, item.networkInterface, item.primaryIp, item.secondaryIp, item.ipv6Ips, item.subnet);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/ecc/" + item.ecc.id + "/eccNetworkInterfaces";

    let ecc = null;
    ecc = <FormGroup>
            <Label for="eccId">Ec2: {item.ecc.id}</Label>
            <Input type="text" name="eccId" id="eccId" value={item.ecc.id || ''} disabled="true"/>
          </FormGroup>;

    let subnet = null; 
    
    if(item.subnet && item.subnet.sCidr) {
    subnet = <FormGroup>
            <Label for="sub">Subnet: {item.subnet.name} - {item.subnet.sCidr.subnetCidr}</Label>
            <Input type="text" name="sub" id="sub" value={item.subnet.id || ''} disabled="true"/>
          </FormGroup>;
    }
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          
          {ecc}
          {subnet}
           <FormGroup>
            <Label for="device">Device (*)</Label>
            <Input type="text" name="device" id="device" value={item.device || ''} placeholder="Enter device"
                   onChange={this.handleChange} onBlur={this.handleBlur('device')} autoComplete="device"
                    valid={errors.device === ''}
                   invalid={errors.device !== ''}
            />
           <FormFeedback>{errors.device}</FormFeedback>
          </FormGroup>

           <FormGroup>
            <Label for="networkInterface">Network Interface (*)</Label>  
            <Input type="select" name="networkInterface" id="networkInterface" value={item.networkInterface || ''} placeholder="Enter networkInterface"
                   onChange={this.handleChange} onBlur={this.handleBlur('networkInterface')} 
                   valid={errors.networkInterface === ''}
                   invalid={errors.networkInterface !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="New">New</option>
            </Input>
           <FormFeedback>{errors.networkInterface}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="primaryIp">Primary Ip (*)</Label>
            <Input type="text" name="primaryIp" id="primaryIp" value={item.primaryIp || ''} placeholder="Enter primaryIp"
                   onChange={this.handleChange} onBlur={this.handleBlur('primaryIp')} autoComplete="primaryIp"
                   valid={errors.primaryIp === ''}
                   invalid={errors.primaryIp !== ''}
            />
           <FormFeedback>{errors.primaryIp}</FormFeedback>
          </FormGroup>
 
          <FormGroup>
            <Label for="secondaryIp">Secondary Ip </Label> 
            <Input type="text" name="secondaryIp" id="secondaryIp" value={item.secondaryIp || ''} placeholder="Enter secondaryIp"
                   onChange={this.handleChange} onBlur={this.handleBlur('secondaryIp')} autoComplete="secondaryIp"
                   valid={errors.secondaryIp === ''}
                   invalid={errors.secondaryIp !== ''}
            />
           <FormFeedback>{errors.secondaryIp}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="ipv6Ips">Ipv6 Ip</Label>
            <Input type="text" name="ipv6Ips" id="ipv6Ips" value={item.ipv6Ips || ''} placeholder="Enter ipv6Ips" disabled='true'
                   onChange={this.handleChange} onBlur={this.handleBlur('ipv6Ips')} autoComplete="ipv6Ips"
                   valid={errors.ipv6Ips === ''}
                   invalid={errors.ipv6Ips !== ''}
            />
           <FormFeedback>{errors.ipv6Ips}</FormFeedback>
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

export default withRouter(EccNetworkInterfaceEdit);