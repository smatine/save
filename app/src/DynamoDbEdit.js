import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class DynamoDbEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
	  account: {},
  	accountId : '',
    touched: {
      name: false,
      accountId: false
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
      const dynamoDb = await (await fetch(`${API_BASE_URL}/dynamoDbs/${this.props.match.params.id}`)).json();
      dynamoDb.touched = {
        name: false,
        accountId: false
      };
      this.setState({item: dynamoDb});

      let item = {...this.state.item};
      item.accountId = dynamoDb.account.id;
      this.setState({item: item});
      
    }
    else {
      const dynamoDb = {
        name: '',
        text: '',
        account: {},
        accountId : '',
        touched: {
          name: false,
          accountId: false
        }
      };
      dynamoDb.touched = {
          name: false,
          accountId: false
      };
      this.setState({item: dynamoDb});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.account = jsonResult;
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
          accountId: true
    };
    const errors = this.validate(item.name, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) return;
    
    const hist= FRT_BASE_URL + '/dynamoDbs'; 

    item.account={id: item.accountId};
    //console.log(item.accountId + '   ' + item.account.id);

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/dynamoDbs/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/dynamoDbs', {
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

  validate(name, accountId) {

    const errors = {
      name: '' ,
      accountId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'account should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit dynamoDb' : 'Add dynamoDb'}</h2>;

    const errors = this.validate(item.name, item.accountId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/dynamoDbs";

    
    let opts = [];
    if(item.account && item.account.length){
      item.account.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    

    let tri = item.accountId || '';
    item.accountId = tri;


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
            <Label for="accountId">accounts (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
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

export default withRouter(DynamoDbEdit);