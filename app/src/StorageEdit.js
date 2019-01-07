import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class StorageEdit extends Component {
 
  emptyItem = {
    name: '',
    text: '',
	  account: {},
  	accountId : '',
    regionId:'',
    regions:[],
    region: {},
    versionning: true,
    cloudWatchMetrics: false,
    encryption: false,
    encryptionType: 'AES-256',
    kmsId:'',
    kms: {},
    kmss: [],
    serverAccessLoging: false,
    storageTargetId: '',
    storageTarget: {},
    storageTargets: [],
    targetPrefix: '',
    cors: '',
    grantAmazonS3ReadAccess: false,
    blockNewPublicAclObject:false, 
    removePublicAccessGranted:false, 
    blockNewPublicBucket:false, 
    blockPublicCross:false, 
    touched: {
      name: false,
      accountId: false,
      regionId: false,
      encryptionType: false,
      kmsId: false,
      storageTargetId: false
     
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
      const storage = await (await fetch(`${API_BASE_URL}/storages/${this.props.match.params.id}`)).json();
      storage.touched = {
        name: false,
        accountId: false,
        regionId: false,
        encryptionType: false,
        kmsId: false,
        storageTargetId: false
      };
      this.setState({item: storage});

      let item = {...this.state.item};
      item.accountId = storage.account.id;
      item.regionId = storage.region.id;
      
      if(item.encryptionType === '') item.encryptionType = 'AES-256';
      if(storage.kms) item.kmsId = storage.kms.id;

      if(storage.storageTarget) item.storageTargetId = storage.storageTarget.id;

       fetch(API_BASE_URL + '/accounts/' + (storage.account.id) + '/kmss',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.kmss = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/accounts/' + (storage.account.id) + '/storages',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.storageTargets = jsonResult;
          this.setState({item: item});
        });

      this.setState({item: item});
      
    }
    else {
      const storage = {
        name: '',
        text: '',
        account: {},
        accountId : '',
        regionId:'',
        regions:[],
        region: {},
        versionning: true,
        cloudWatchMetrics: false,
        encryption: false,
        encryptionType: 'AES-256',
        kmsId:'',
        kms: {},
        kmss: [],
        serverAccessLoging: false,
        storageTargetId: '',
        storageTarget: {},
        storageTargets: [],
        targetPrefix: '',
        cors: '',
        grantAmazonS3ReadAccess: false,
        blockNewPublicAclObject:false, 
        removePublicAccessGranted:false, 
        blockNewPublicBucket:false, 
        blockPublicCross:false, 
        touched: {
          name: false,
          accountId: false,
          regionId: false,
          encryptionType: false,
          kmsId: false,
          storageTargetId: false
        }
      };
      storage.touched = {
          name: false,
          accountId: false,
          regionId: false,
          encryptionType: false,
          kmsId: false,
          storageTargetId: false
      };

      this.setState({item: storage});
    }

    await fetch(API_BASE_URL + '/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.account = jsonResult;
      this.setState({item: item});
    })

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
    // 
    if(name === 'serverAccessLoging')
    {
      item.serverAccessLoging = (target.checked) ? true: false;
    }

    if(name === 'versionning')
    {
      item.versionning = (target.checked) ? true: false;
    }
    if(name === 'cloudWatchMetrics')
    {
      item.cloudWatchMetrics = (target.checked) ? true: false;
    }

    if(name === 'encryption')
    {
      item.encryption = (target.checked) ? true: false;
    }

    if(name === 'type')
    {
      if(value === 'AES-256'){
        item.encryptionType = 'AES-256';
      }
      else
      {
        item.encryptionType = 'AWS-KMS';
      }
    }


    if(name === 'blockNewPublicAclObject')
    {
      item.blockNewPublicAclObject = (target.checked) ? true: false;
    }
    if(name === 'removePublicAccessGranted')
    {
      item.removePublicAccessGranted = (target.checked) ? true: false;
    }
    if(name === 'blockNewPublicBucket')
    {
      item.blockNewPublicBucket = (target.checked) ? true: false;
    }
    if(name === 'blockPublicCross')
    {
      item.blockPublicCross = (target.checked) ? true: false;
    }

    if(name === 'accountId')
    {
     
      fetch(API_BASE_URL + '/accounts/' + item.accountId + '/kmss',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.kmss = jsonResult;
          this.setState({item: item});
        });

        fetch(API_BASE_URL + '/accounts/' + item.accountId  + '/storages',) 
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.storageTargets = jsonResult;
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
          regionId: true,
          encryptionType: true,
          kmsId: true,
          storageTargetId: true
    };
    const errors = this.validate(item.name, item.accountId, item.regionId, item.encryptionType, item.kmsId, item.storageTargetId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= FRT_BASE_URL + '/storages'; 

    
    item.account={id: item.accountId};
    item.region={id: item.regionId};

    if (!item.encryption)
    {
      item.encryptionType = '';
      item.kms= null;
    }
    else 
    {
      if(item.encryptionType === 'AWS-KMS') item.kms = {id : item.kmsId};
      else item.kms= null;
    }

    if (!item.serverAccessLoging)
    {
      item.targetPrefix = null;
      item.storageTarget = null;
    }
    else
    {
      //console.log(item.storageTarget + '   ' + item.storageTargetId);
      item.storageTarget = {id: item.storageTargetId};
    }
    
    //console.log(item.accountId + '   ' + item.account.id);

    await fetch((item.id) ? API_BASE_URL + '/accounts/' + (item.account.id) + '/storages/'+(item.id) : API_BASE_URL + '/accounts/' + item.account.id + '/storages', {
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

  validate(name, accountId, regionId, encryptionType, kmsId, storageTargetId) {

    const errors = {
      name: '' ,
      accountId: '',
      regionId: '',
      encryptionType: '',
      kmsId: '',
      storageTargetId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'account should not be null';
      return errors;
    }
    if(this.state.item.touched.regionId && regionId.length === 0){
      errors.regionId = 'regionId should not be null';
      return errors;
    }
    if(this.state.item.encryption && this.state.item.touched.encryptionType && encryptionType.length === 0){
      errors.encryptionType = 'encryptionType should not be null';
      return errors;
    }
    if(this.state.item.encryption && this.state.item.encryptionType === 'AWS-KMS' && this.state.item.touched.kmsId && kmsId.length === 0){
      errors.kmsId = 'kmsId should not be null';
      return errors;
    }
    if(this.state.item.serverAccessLoging && this.state.item.touched.storageTarget  && storageTargetId.length === 0){
      errors.storageTargetId = 'storageTarget should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit storage' : 'Add storage'}</h2>;

    const errors = this.validate(item.name, item.accountId, item.regionId, item.encryptionType, item.kmsId, item.storageTagetId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/storages";

    
    let opts = [];
    if(item.account && item.account.length){
      item.account.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.numAccount}</option>);
      });
    }
    let tri = item.accountId || '';
    item.accountId = tri;

    let optrs = [];
    if(item.regions && item.regions.length){
      item.regions.map(r => {  
          optrs.push(<option value={r.id}>{r.id} {r.name}</option>);
      });
    }
    let region = item.regionId || '';
    item.regionId = region;

    let optks = [];
    if(item.kmss && item.kmss.length){
      item.kmss.map(r => {  
          optks.push(<option value={r.id}>{r.id} {r.alias}</option>);
      });
    }
    let kms = item.kmsId || '';
    item.kmsId = kms;

    let optss = [];
    if(item.storageTargets && item.storageTargets.length){
      item.storageTargets.map(r => {  
          optss.push(<option value={r.id}>{r.id} {r.name}</option>);
      });
    }
    let storageTarget = item.storageTargetId || '';
    item.storageTargetId = storageTarget;

    let encryptionType = (item.encryption) ? <FormGroup tag="fieldset">
            <Label for="type">Encryption Type(*)</Label>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="type" id="type" value="AES-256" checked={item.encryptionType === 'AES-256'}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                AES-256
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="type" id="type" value="AWS-KMS" checked={item.encryptionType === 'AWS-KMS'}
                       onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                       valid={errors.type === ''}
                       invalid={errors.type !== ''}
                />{' '}
                 AWS-KMS
              </Label>
            </FormGroup>
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup> : '';
    
    let kmss = (item.encryption && item.encryptionType === 'AWS-KMS' ) ? <FormGroup>
            <Label for="kmsId">Kms (*)</Label>
            <Input type="select" name="kmsId" id="kmsId"  value={kms} onChange={this.handleChange} onBlur={this.handleBlur('kmsId')}
                 valid={errors.kmsId === ''}
                 invalid={errors.kmsId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optks}
            </Input>
            <FormFeedback>{errors.kmsId}</FormFeedback>
          </FormGroup> : '';
    
    let storageTargets = (item.serverAccessLoging) ? <FormGroup>
            <Label for="storageTargetId">Storage Target (*)</Label>
            <Input type="select" name="storageTargetId" id="storageTargetId"  value={storageTarget} onChange={this.handleChange} onBlur={this.handleBlur('storageTargetId')}
                 valid={errors.storageTargetId === ''}
                 invalid={errors.storageTargetId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.storageTargetId}</FormFeedback>
          </FormGroup> : '';

    
    let targetPrefix = (item.serverAccessLoging) ? <FormGroup>
            <Label for="targetPrefix">Target Prefix (*)</Label>
            <Input type="text" name="targetPrefix" id="targetPrefix" value={item.targetPrefix || ''} placeholder="Enter targetPrefix"
                   onChange={this.handleChange} onBlur={this.handleBlur('targetPrefix')} autoComplete="targetPrefix"
                   valid={errors.targetPrefix === ''}
                   invalid={errors.name !== ''}
            />
           <FormFeedback>{errors.targetPrefix}</FormFeedback>
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
            <Label for="regionId">Region (*)</Label>
            <Input type="select" name="regionId" id="regionId"  value={region} onChange={this.handleChange} onBlur={this.handleBlur('regionId')}
                 valid={errors.regionId === ''}
                 invalid={errors.regionId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optrs}
            </Input>
            <FormFeedback>{errors.regionId}</FormFeedback>
          </FormGroup>
         
         <FormGroup > 
            <Label for="versionning">Versionning:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="versionning" id="versionning" 
                    onChange={this.handleChange} onBlur={this.handleBlur('versionning')} 
                    checked={item.versionning === true}/>
          </FormGroup>


           <FormGroup > 
            <Label for="encryption">Encryption:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="encryption" id="encryption" 
                    onChange={this.handleChange} onBlur={this.handleBlur('encryption')} 
                    checked={item.encryption === true}/>
          </FormGroup>


          {encryptionType}
          {kmss}

          <FormGroup >
            <Label for="cloudWatchMetrics">Cloud Watch Metrics:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="cloudWatchMetrics" id="cloudWatchMetrics" 
                    onChange={this.handleChange} onBlur={this.handleBlur('cloudWatchMetrics')} 
                    checked={item.cloudWatchMetrics === true}/>
          </FormGroup>

          <FormGroup > 
            <Label for="serverAccessLoging">Server Access Loging:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="serverAccessLoging" id="serverAccessLoging" 
                    onChange={this.handleChange} onBlur={this.handleBlur('serverAccessLoging')} 
                    checked={item.serverAccessLoging === true}/>
          </FormGroup>
          
          {storageTargets}
          {targetPrefix}

          <FormGroup> 
            <Label for="">Public access settings for this bucket</Label>
            <FormText>Use the Amazon S3 block public access settings to enforce that buckets don\''t allow public access to data. You can also configure the Amazon S3 block public access settings at the account level</FormText>
          </FormGroup>

          <FormGroup>
            <Label for="">Manage public access control lists (ACLs) for this bucket</Label>
            <FormText></FormText>
          </FormGroup>
          <FormGroup > 
            <Label for="blockNewPublicAclObject">Block new public ACLs and uploading public objects (Recommended):</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="blockNewPublicAclObject" id="blockNewPublicAclObject" 
                    onChange={this.handleChange} onBlur={this.handleBlur('blockNewPublicAclObject')} 
                    checked={item.blockNewPublicAclObject === true}/>
          </FormGroup>
          <FormGroup > 
            <Label for="removePublicAccessGranted">Remove public access granted through public ACLs (Recommended):</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="removePublicAccessGranted" id="removePublicAccessGranted" 
                    onChange={this.handleChange} onBlur={this.handleBlur('removePublicAccessGranted')} 
                    checked={item.removePublicAccessGranted === true}/>
          </FormGroup>

           <FormGroup>
            <Label for="">Manage public bucket policies for this bucket</Label>
            <FormText></FormText>
          </FormGroup>
          <FormGroup > 
            <Label for="blockNewPublicBucket">Block new public bucket policies (Recommended):</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="blockNewPublicBucket" id="blockNewPublicBucket" 
                    onChange={this.handleChange} onBlur={this.handleBlur('blockNewPublicBucket')} 
                    checked={item.blockNewPublicBucket === true}/>
          </FormGroup>
          <FormGroup > 
            <Label for="blockPublicCross">Block public and cross-account access if bucket has public policies (Recommended):</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="blockPublicCross" id="blockPublicCross" 
                    onChange={this.handleChange} onBlur={this.handleBlur('blockPublicCross')} 
                    checked={item.blockPublicCross === true}/>
          </FormGroup>
          

          <FormGroup>
            <Label for="grantAmazonS3ReadAccess">Grant Amazon S3 Delivery Read Access (*)</Label>
            <Input type="select" name="grantAmazonS3ReadAccess" id="grantAmazonS3ReadAccess"  value={item.grantAmazonS3ReadAccess} onChange={this.handleChange} onBlur={this.handleBlur('grantAmazonS3ReadAccess')}
            >
              <option value="false">Do not grant Amazon S3 Log Delivery group write access to this bucket</option>
              <option value="true">Grant Amazon S3 Log Delivery group write access to this bucket</option>
            </Input>
             
          </FormGroup>

          <FormGroup>
            <Label for="cors">Cors Configuration</Label>
            <Input type="textarea" name="cors" id="cors" value={item.cors || ''}
                   placeholder='<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>*</AllowedOrigin>
   <AllowedMethod>GET</AllowedMethod>
   <AllowedHeader>Authorization</AllowedHeader>
  <MaxAgeSeconds>3000</MaxAgeSeconds>
 </CORSRule>
</CORSConfiguration>'
                   onChange={this.handleChange} autoComplete="cors"/>
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

export default withRouter(StorageEdit);