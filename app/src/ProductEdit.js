import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ProductEdit extends Component {

  emptyItem = {
    name: '',
    mailList: '',
    type: '',
    bastion: '',
    mailListAlert: '',
    text: '',
    appContext: '',
	  trigramme: {},
  	trigrammeId : '',
    touched: {
      name: false,
      mailList: false,
      type: false,
      bastion: false,
      trigrammeId: false
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
      const product = await (await fetch(`${API_BASE_URL}/products/${this.props.match.params.id}`)).json();
      product.touched = {
        name: false,
        trigrammeId: false
      };
      this.setState({item: product});

      let item = {...this.state.item};
      item.trigrammeId = product.trigramme.id;
      this.setState({item: item});
      
    }
    else {
      //alert(`/trigrammes/${this.props.match.params.idt}`);      
      //const trigramme = await (await fetch(`/trigrammes/${this.props.match.params.idt}`)).json();
      const product = {
        name: '',
        mailList: '',
        type: '',
        bastion: '',
        mailListAlert: '',
        text: '',
        appContext: '',
        trigramme: {},
        trigrammeId : '',
        touched: {
          name: false,
          mailList: false,
          type: false,
          bastion: false,
          trigrammeId: false
        }
      };
      product.touched = {
          name: false,
          mailList: false,
          type: false,
          bastion: false,
          trigrammeId: false
      };
      this.setState({item: product});
    }

    await fetch(API_BASE_URL + '/trigrammes',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.trigramme = jsonResult;
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
          name: true,
          mailList: true,
          type: true,
          bastion: true,
          trigrammeId: true
    };
    const errors = this.validate(item.name, item.mailList, item.type, item.bastion, item.trigrammeId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    const hist= FRT_BASE_URL + '/products'; 

    item.trigramme={id: item.trigrammeId};
    //console.log(item.trigrammeId + '   ' + item.trigramme.id);

    await fetch((item.id) ? API_BASE_URL + '/trigrammes/' + (item.trigramme.id) + '/products/'+(item.id) : API_BASE_URL + '/trigrammes/' + item.trigramme.id + '/products', {
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

  validate(name, mailList, type, bastion, trigrammeId) {

    const errors = {
      name: '' ,
      mailList: '',
      type: '',
      bastion: '',
      trigrammeId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.type && type.length === 0){
      errors.type = 'Type should not be null';
      return errors;
    }
    else if(this.state.item.touched.bastion && bastion.length === 0){
      errors.bastion = 'Bastion should not be null';
      return errors;
    }
    
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(this.state.item.touched.mailList && !emailRex.test(mailList)){
      errors.mailList = 'mailList should have correct format ';
      return errors;
    }

    /*if(!this.state.item.id && this.state.item.touched.trigrammeId && trigrammeId.length === 0){
      errors.trigrammeId = 'trigramme should not be null';
      return errors;
    }*/
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Product' : 'Add Product'}</h2>;

    const errors = this.validate(item.name, item.mailList, item.type, item.bastion, item.trigrammeId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/products";

    /*let accs = null;
    accs = <FormGroup>
            <Label for="trigrammeId">Trigramme: {item.trigramme.name}</Label>
            <Input type="text" name="trigrammeId" id="trigrammeId" value={item.trigramme.id || ''} disabled="true"/>
          </FormGroup>;
    */
    /*let acc = null;
    if(item.id) acc = <Button size="sm" color="secondary" tag={Link} to={"/product/" + item.id + "/accounts"}>Accounts</Button>;*/

    let opts = [];
    if(item.trigramme && item.trigramme.length){
      item.trigramme.map(s => {  
          opts.push(<option key={s.id} value={s.id}>{s.id} {s.name}</option>);
      });
    }
    if(item.id) {
          opts.push(<option key={item.trigramme.id} value={item.trigramme.id} >{item.trigramme.id} {item.trigramme.name} </option>);
    }

    let tri = item.trigrammeId || '';
    item.trigrammeId = tri;


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
            <Label for="trigrammeId">Trigrammes (*)</Label>
            <Input type="select" name="trigrammeId" id="trigrammeId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('trigrammeId')}
                 valid={errors.trigrammeId === ''}
                 invalid={errors.trigrammeId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.trigrammeId}</FormFeedback>
          </FormGroup>
                    
          <FormGroup>
            <Label for="type">Type (*)</Label>
            <Input type="text" name="type" id="type" value={item.type || ''} placeholder="Enter type"
                   onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                   valid={errors.type === ''}
                   invalid={errors.type !== ''}
            />
           <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>

  
		      <FormGroup>
            <Label for="bastion">Bastion (*)</Label>
            <Input type="text" name="bastion" id="bastion" value={item.bastion || ''} placeholder="Enter bastion"
                   onChange={this.handleChange} onBlur={this.handleBlur('bastion')} autoComplete="bastion"
                   valid={errors.bastion === ''}
                   invalid={errors.bastion !== ''}
            />
           <FormFeedback>{errors.bastion}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="mailList">mailList (*)</Label>
            <Input type="email" name="mailList" id="mailList" value={item.mailList || ''} placeholder="Enter mailList"
                   onChange={this.handleChange} onBlur={this.handleBlur('mailList')} autoComplete="mailList"
                   valid={errors.mailList === ''}
                   invalid={errors.mailList !== ''}
            />
           <FormFeedback>{errors.mailList}</FormFeedback>
          </FormGroup>


		      <FormGroup>
            <Label for="mailListAlert">mailListAlert</Label>
            <Input type="email" name="mailListAlert" id="mailListAlert" value={item.mailListAlert || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>

          <FormGroup>
            <Label for="appContext">APP Context</Label>
            <Input type="text" name="appContext" id="appContext" value={item.appContext || ''} placeholder="Enter app context"
                   onChange={this.handleChange} autoComplete="appContext"
                   
                   />
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

export default withRouter(ProductEdit);