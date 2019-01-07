import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class StorageAclEdit extends Component {

  emptyItem = {
    externalAccount: '',
    accountId: '',
    storage: {},
    type: 'Internal',
    read: false,
    write: false,
    listObject: false,
    writeObject: false,
    groupe:'',
    store:'',
    touched: {
      externalAccount: false,
      accountId: false,
      type: false,
      groupe: false,
      store:false
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
      const storageAcl = await (await fetch(`${API_BASE_URL}/storageAcls/${this.props.match.params.id}`)).json();
      storageAcl.touched = {
        externalAccount: false,
        accountId: false,
        type: false,
        groupe: false,
        store:false
      };
      this.setState({item: storageAcl});
      let item = {...this.state.item};
      item.accountId = item.storage.account.id;
      item.groupe = 'Everyone';
      item.store  = 'Log Delivery';
      this.setState({item: item});
      
    }
    else {
      const storage = await (await fetch(`${API_BASE_URL}/storages/${this.props.match.params.ids}`)).json();
      const storageAcl = {
        externalAccount: '',
        accountId: '',
        storage: {},
        type: 'Internal',
        read: false,
        write: false,
        listObject: false,
        writeObject: false,
        groupe:'',
        store:'',
        touched: {
          externalAccount: false,
          accountId: false,
          type: false,
          groupe: false,
          store:false
        }
      };
      storageAcl.storage = storage;
      storageAcl.accountId = storage.account.id;
      storageAcl.touched = {
          externalAccount: false,
          accountId: false,
          type: false,
          groupe: false,
          store:false
      };
      storageAcl.groupe = 'Everyone';
      storageAcl.store  = 'Log Delivery';
      this.setState({item: storageAcl});
    }


  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
    /*if(name === 'type')
    {
      item.type = (target.checked) ? true: false;
    }*/
    if(name === 'read')
    {
      item.read = (target.checked) ? true: false;
    }
    if(name === 'write')
    {
      item.write = (target.checked) ? true: false;
    }

    if(name === 'listObject')
    {
      item.listObject = (target.checked) ? true: false;
    }
    if(name === 'writeObject')
    {
      item.writeObject = (target.checked) ? true: false;
    }
    

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          externalAccount: true,
          accountId: true,
          type: true,
          groupe: true,
          store:true
    };
    const errors = this.validate(item.externalAccount, item.accountId, item.type, item.groupe, item.store);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/storage/' + item.storage.id +'/storageacls'; 

    item.storage={id: item.storage.id};
    
    if(item.type === 'Internal')
    {
      item.externalAccount = '';
      item.account = {id: item.accountId};
      item.groupe = '';
      item.store = '';
    }
    else if(item.type === 'External')
    {
      item.accountId = null;
      item.groupe = '';
      item.store = '';
    }
    else if(item.type === 'Group')
    {
      item.accountId = null;
      item.externalAccount = '';
      item.store = '';
    }
    else if(item.type === 'S3')
    {
      item.accountId = null;
      item.externalAccount = '';
      item.groupe = '';
    }
    

        

    await fetch((item.id) ? API_BASE_URL + '/storages/' + (item.storage.id) + '/storageAcls/'+(item.id) : API_BASE_URL + '/storages/' + item.storage.id + '/storageAcls', {
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

  validate(externalAccount, accountId, type, groupe, store) {

    const errors = {
      externalAccount: '',
      accountId: '',
      type: '',
      groupe: '',
      store: ''
    };
    
    if(this.state.item.type === 'External' && this.state.item.touched.externalAccount && externalAccount.length === 0){
      errors.externalAccount = 'External Account should not be null';
      return errors;
    } 
    else if(this.state.item.type === 'Internal' && this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Account should not be null';
      return errors;
    }
    else if(this.state.item.type === 'Group' && this.state.item.touched.groupe && groupe.length === 0){
      errors.groupe = 'Group should not be null';
      return errors;
    } 
    else if(this.state.item.type === 'S3' && this.state.item.touched.store && store.length === 0){
      errors.store = 'S3 delivery should not be null';
      return errors;
    } 
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit S3 Acl' : 'Add S3 Acl'}</h2>;

    const errors = this.validate(item.externalAccount, item.accountId, item.type, item.groupe, item.store);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/storage/" + item.storage.id + "/storageacls";

    let storage = null;
    storage = <FormGroup>
            <Label for="storageId">Storage: {item.storage.name}</Label>
            <Input type="text" name="storageId" id="storageId" value={item.storage.id || ''} disabled="true"/>
          </FormGroup>;

    let account = (item.type === 'Internal') ? <FormGroup>
            <Label for="accountId">Access for your AWS account (*)</Label>
            <Input type="text" name="accountId" id="accountId" value={item.accountId || ''} placeholder="Enter accountId" disabled='true'
                   onChange={this.handleChange} onBlur={this.handleBlur('accountId')} autoComplete="accountId"
                   valid={errors.accountId === ''}
                   invalid={errors.accountId !== ''}
            />
           <FormFeedback>{errors.accountId}</FormFeedback>
          </FormGroup> : '' ;

    let externalAccount = (item.type  === 'External') ? <FormGroup>
            <Label for="externalAccount">Access for other AWS accounts (*)</Label>
            <Input type="text" name="externalAccount" id="externalAccount" value={item.externalAccount || ''} placeholder="Enter externalAccount"
                   onChange={this.handleChange} onBlur={this.handleBlur('externalAccount')} autoComplete="externalAccount"
                   valid={errors.externalAccount === ''}
                   invalid={errors.externalAccount !== ''}
            />
           <FormFeedback>{errors.externalAccount}</FormFeedback>
          </FormGroup> : '' ;

    let groupe = (item.type  === 'Group') ? <FormGroup>
            <Label for="groupe">Public access (*)</Label>
            <Input type="text" name="groupe" id="groupe" value={item.groupe || ''} placeholder="Enter groupe" disabled='true'
                   onChange={this.handleChange} onBlur={this.handleBlur('groupe')} autoComplete="groupe"
                   valid={errors.groupe === ''}
                   invalid={errors.groupe !== ''}
            />
           <FormFeedback>{errors.groupe}</FormFeedback>
          </FormGroup> : '' ;
    let store = (item.type  === 'S3') ? <FormGroup>
            <Label for="store">S3 log delivery groupe (*)</Label>
            <Input type="text" name="store" id="store" value={item.store || ''} placeholder="Enter store" disabled='true'
                   onChange={this.handleChange} onBlur={this.handleBlur('store')} autoComplete="store"
                   valid={errors.store === ''}
                   invalid={errors.store !== ''}
            />
           <FormFeedback>{errors.store}</FormFeedback>
          </FormGroup> : '' ;
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

        {storage}

          <FormGroup>
            <Label for="type">type(*)</Label>
            <Input type="select" name="type" id="type"  value={item.type} onChange={this.handleChange} onBlur={this.handleBlur('type')}
            >
              <option value="Internal">Internal Account</option>
              <option value="External">External Account</option>
              <option value="Group">Public access</option>
              <option value="S3">S3 log delivery group</option>
            </Input>
             
          </FormGroup>

          
          {externalAccount}
          {account}
          {groupe}
          {store}



          <FormGroup > 
            <Label for="listObject">List Object:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="listObject" id="listObject" 
                    onChange={this.handleChange} onBlur={this.handleBlur('listObject')} 
                    checked={item.listObject === true}/>
          </FormGroup>
          <FormGroup > 
            <Label for="writeObject">Write Object:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="writeObject" id="writeObject" 
                    onChange={this.handleChange} onBlur={this.handleBlur('writeObject')} 
                    checked={item.writeObject === true}/>
          </FormGroup>

          <FormGroup > 
            <Label for="read">Read bucket permissions:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="read" id="read" 
                    onChange={this.handleChange} onBlur={this.handleBlur('read')} 
                    checked={item.read === true}/>
          </FormGroup>

          <FormGroup > 
            <Label for="write">Write bucket permissions:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="write" id="write" 
                    onChange={this.handleChange} onBlur={this.handleBlur('write')} 
                    checked={item.write === true}/>
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

export default withRouter(StorageAclEdit);