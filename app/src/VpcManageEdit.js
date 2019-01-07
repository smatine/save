import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

const cidrRegex = require('cidr-regex');
class VpcManageEdit extends Component {

  emptyItem = {
    cidr: '',
    text: '',
    env: '',
    vpc: {id: ''},
    regions: {},
    region: {},
    regionId: '',
    touched: {
      cidr: false,
      env: false,
      regionId: false
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
      const cidr = await (await fetch(`${API_BASE_URL}/cidrs/${this.props.match.params.id}`)).json();
      
      cidr.touched = {
        cidr: false,
        env: false,
        regionId: false
      };
      
      this.setState({item: cidr});
      let item = {...this.state.item};
      item.regionId = cidr.region.id;
      this.setState({item: item});
      
    }
    else {
      const cidr = {
        cidr: '',
        text: '',
        env: '',
        vpc: {id: ''},
        regions: {},
        region: {},
        regionId: '',
        touched: {
          cidr: false,
          env: false,
          regionId: false
        }
      };
      this.setState({item: cidr});
    }

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
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
        cidr: true,
        env: true
    };
    const errors = this.validate(item.cidr, item.env);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
      alert(errors.cidr + "  " + errors.env);
      return;
    }
    let cidrs;

    let ip ='';
    ip = item.cidr;
    let newIp = ip.replace('/', '@');

    item.region={id: item.regionId};

    await fetch((item.id) ? API_BASE_URL + '/cidr/' + newIp + '/env/' + item.env + '/cidrId/' + item.id : API_BASE_URL + '/cidr/' + newIp + '/env/' + item.env + '/cidrId/0',)
    .then((result) => {
      // Get the result
      // If we want text, call result.text()
      return result.json();
    }).then((jsonResult) => {
      // Do something with the result
      cidrs = jsonResult.length;
      console.log(jsonResult.length);
    })
    if(cidrs !== 0) {
      errors.cidr="Cidr should be unique by env";
      alert(errors.cidr);
      return ;
    }
    
    
    if(!item.id) item.vpc=null; 
    const hist= FRT_BASE_URL + '/vpcmanage';

    await fetch((item.id) ? API_BASE_URL + '/cidrs/'+(item.id) : API_BASE_URL + '/cidr', {
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

  validate(cidr, env, regionId) {

    const errors = {
      cidr: '',
      env: '',
      regionId:''
    };

    if(this.state.item.touched.cidr && cidr.length === 0){
      errors.cidr = 'cidr should not be null';
      return errors;
    }
    if(this.state.item.touched.cidr && !cidrRegex({exact: true}).test(cidr))
    {
      errors.cidr = 'cidr should  be a cidr format';
      return errors;
    }
    if(this.state.item.touched.env && env.length === 0){
      errors.env = 'env should not be null';
      return errors;
    }
    if(this.state.item.touched.regionId && regionId.length === 0){
      errors.regionId = 'Region should not be null';
      return errors;
    }
    
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Cidr' : 'Add Cidr'}</h2>;


    const errors = this.validate(item.cidr, item.env, item.regionId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/vpcmanage";
    
    let isDisabledd = false;
    if(item.vpc && item.vpc.id) isDisabledd = true;

    
    let optsr = [];
    if(item.regions && item.regions.length){
          item.regions.map(s => {  
          optsr.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }

    let reg = item.regionId || '';
    item.regionId = reg;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="cidr">CIDR (*)</Label>
            <Input type="text" name="cidr" id="cidr" value={item.cidr || ''}
                   onChange={this.handleChange} onBlur={this.handleBlur('cidr')} autoComplete="cidr"
                   valid={errors.cidr === ''}
                   invalid={errors.cidr !== ''}
                   disabled={isDisabledd}
            />
            <FormFeedback>{errors.cidr}</FormFeedback>
          </FormGroup>
          
          <FormGroup>
            <Label for="regionId">Region (*)</Label>
            <Input type="select" name="regionId" id="regionId"  value={reg} onChange={this.handleChange} onBlur={this.handleBlur('regionId')}
                 valid={errors.regionId === ''}
                 invalid={errors.regionId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsr}
            </Input>
            <FormFeedback>{errors.regionId}</FormFeedback>
          </FormGroup>
      
          <FormGroup>
            <Label for="env">Env (*)</Label>
            <Input type="select" name="env" id="env" value={item.env || ''} onChange={this.handleChange} onBlur={this.handleBlur('env')}
                 valid={errors.env === ''}
                 invalid={errors.env !== ''}
                 disabled={isDisabledd}
            >
              <option value="" disabled>Choose</option>
              <option value="DEV">DEV</option>
              <option value="HML">HML</option>
              <option value="PRD">PRD</option>
              <option value="SDB">SDB</option>
            </Input>
            <FormFeedback>{errors.env}</FormFeedback>
          </FormGroup>

      
          <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="env"
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

export default withRouter(VpcManageEdit);