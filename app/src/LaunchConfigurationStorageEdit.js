import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { API_BASE_URL, FRT_BASE_URL } from './constants';


class LaunchConfigurationStorageEdit extends Component {

  emptyItem = {
    volumeType: '',
    device: '',
    snapshot: '',
    size: '',
    volume: '', 
    iops: '', 
    throughput: '', 
    deleteOnTermination: true, 
    encrypted: '',
    launchConfiguration: {},
    touched: {
      volumeType:false,
      device: false,
      snapshot: false,
      volume: false, 
      iops: false,
      throughput: false,  
      encrypted: false
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
      const launchConfigurationStorage = await (await fetch(`${API_BASE_URL}/launchConfigurationStorages/${this.props.match.params.id}`)).json();
      launchConfigurationStorage.touched = {
        volumeType:false,
        device: false,
        snapshot: false,
        volume: false, 
        iops: false,
        throughput: false,  
        encrypted: false
      };
      this.setState({item: launchConfigurationStorage});
      
    }
    else {
      const launchConfiguration = await (await fetch(`${API_BASE_URL}/launchConfigurations/${this.props.match.params.idl}`)).json();
      const launchConfigurationStorage = {
        volumeType: '',
        device: '',
        snapshot: '',
        size: '',
        volume: '', 
        iops: '', 
        throughput: '', 
        deleteOnTermination: true, 
        encrypted: '',
        launchConfiguration: {},
        touched: {
          volumeType:false,
          device: false,
          snapshot: false,
          volume: false, 
          iops: false,
          throughput: false,  
          encrypted: false
        }
      };
      launchConfigurationStorage.launchConfiguration = launchConfiguration;
      launchConfigurationStorage.touched = {
          volumeType:false,
          device: false,
          snapshot: false,
          volume: false,  
          iops: false,
          throughput: false,  
          encrypted: false
      };
      this.setState({item: launchConfigurationStorage});
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
      volumeType:true, 
      device: true,
      snapshot: true,
      volume: true, 
      iops: true,
      throughput: true,  
      encrypted: true
    };
    const errors = this.validate(item.volumeType, item.device, item.snapshot, item.volume,  item.iops, item.throughput, item.encrypted);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= FRT_BASE_URL + '/launchConfiguration/' + item.launchConfiguration.id +'/launchConfigurationStorages'; 

    item.launchConfiguration={id: item.launchConfiguration.id};
    
    //return;

    await fetch((item.id) ? API_BASE_URL + '/launchConfigurations/' + (item.launchConfiguration.id) + '/launchConfigurationStorages/'+(item.id) : API_BASE_URL + '/launchConfigurations/' + item.launchConfiguration.id + '/launchConfigurationStorages', {
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

  validate(volumeType, device, snapshot,  volume,  iops, throughput, encrypted) {

    const errors = {
      volumeType:'', 
      device: '',
      snapshot: '',
      volume: '', 
      iops: '',
      throughput: '',  
      encrypted: ''
    };

    
    if(this.state.item.touched.volumeType && volumeType.length === 0){
      errors.volumeType = 'volumeType should not be null';
      return errors;
    }
    else if(this.state.item.touched.device && device.length === 0){
      errors.device = 'device should not be null';
      return errors;
    }
    else if(this.state.item.touched.snapshot && snapshot.length === 0){
      errors.snapshot = 'snapshot should not be null';
      return errors;
    }
    else if(this.state.item.touched.volume && volume.length === 0){
      errors.volume = 'volume should not be null';
      return errors;
    }
    else if(this.state.item.touched.iops && iops.length === 0){
      errors.iops = 'iops should not be null';
      return errors;
    }
    else if(this.state.item.touched.throughput && throughput.length === 0){
      errors.throughput = 'throughput should not be null';
      return errors;
    }
    else if(this.state.item.touched.encrypted && encrypted.length === 0){
      errors.encrypted = 'encrypted should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Ec2 Storage' : 'Add Ec2 Storage'}</h2>;

    const errors = this.validate(item.volumeType, item.device, item.snapshot, item.volume, item.iops, item.throughput, item.encrypted);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = FRT_BASE_URL + "/launchconfiguration/" + item.launchConfiguration.id + "/launchConfigurationStorages";

    let launchConfiguration = null;
    launchConfiguration = <FormGroup>
            <Label for="launchConfigurationId">Ec2: {item.launchConfiguration.id}</Label>
            <Input type="text" name="launchConfigurationId" id="launchConfigurationId" value={item.launchConfiguration.id || ''} disabled="true"/>
          </FormGroup>;
    let device = null;
    device = (item.volumeType === 'Root') ?  <FormGroup>
            <Label for="device">Device (*)</Label>            
            <Input type="select" name="device" id="device" value={item.device || ''} placeholder="Enter device"
                   onChange={this.handleChange} onBlur={this.handleBlur('device')} 
                   valid={errors.device === ''}
                   invalid={errors.device !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="/dev/xvda">/dev/xvda</option>
            </Input>
           <FormFeedback>{errors.device}</FormFeedback>
          </FormGroup> : <FormGroup> <Label for="device">Device (*)</Label>            
            <Input type="select" name="device" id="device" value={item.device || ''} placeholder="Enter device"
                   onChange={this.handleChange} onBlur={this.handleBlur('device')} 
                   valid={errors.device === ''}
                   invalid={errors.device !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="/dev/sdb">/dev/sdb</option>
              <option value="/dev/sdc">/dev/sdc</option>
              <option value="/dev/sdd">/dev/sdd</option>
              <option value="/dev/sde">/dev/sde</option>
              <option value="/dev/sdf">/dev/sdf</option>
              <option value="/dev/sdg">/dev/sdg</option>
              <option value="/dev/sdh">/dev/sdh</option>
              <option value="/dev/sdi">/dev/sdi</option>
              <option value="/dev/sdj">/dev/sdj</option>
              <option value="/dev/sdk">/dev/sdk</option>
              <option value="/dev/sdl">/dev/sdl</option>
            </Input>
           <FormFeedback>{errors.device}</FormFeedback>
          </FormGroup>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          
          {launchConfiguration}


           <FormGroup>
            <Label for="volumeType">Volume Type (*)</Label>  
            <Input type="select" name="volumeType" id="volumeType" value={item.volumeType || ''} placeholder="Enter volumeType"
                   onChange={this.handleChange} onBlur={this.handleBlur('volumeType')} 
                   valid={errors.volumeType === ''}
                   invalid={errors.volumeType !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Root">Root</option>
              <option value="EBS">EBS</option>
            </Input>
           <FormFeedback>{errors.volumeType}</FormFeedback>
          </FormGroup>

          {device}

          <FormGroup>
            <Label for="snapshot">Snapshot (*)</Label>
            <Input type="text" name="snapshot" id="snapshot" value={item.snapshot || ''} placeholder="Enter snapshot"
                   onChange={this.handleChange} onBlur={this.handleBlur('snapshot')} autoComplete="snapshot"
                   valid={errors.snapshot === ''}
                   invalid={errors.snapshot !== ''}
            />
           <FormFeedback>{errors.snapshot}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="size">Size (*)</Label>
            <Input type="number" name="size" id="size" value={item.size || ''} placeholder="Enter size"
                   onChange={this.handleChange} onBlur={this.handleBlur('size')} autoComplete="size"
            />
          </FormGroup>

          <FormGroup>
            <Label for="volume">Volume Type(*)</Label>           
            <Input type="select" name="volume" id="volume" value={item.volume || ''} placeholder="Enter volume"
                   onChange={this.handleChange} onBlur={this.handleBlur('volume')} autoComplete="volume"
                   valid={errors.volume === ''}
                   invalid={errors.volume !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="gp2">General Purpose SSD (gp2)</option>
              <option value="io1">Provisioned IOPS SSD (io1)</option>
              <option value="standard">Magnetic (standard)</option>
            </Input>
           <FormFeedback>{errors.volume}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="iops">Iops (*)</Label>
            <Input type="text" name="iops" id="iops" value={item.iops || ''} placeholder="Enter iops"
                   onChange={this.handleChange} onBlur={this.handleBlur('iops')} autoComplete="iops"
                    valid={errors.iops === ''}
                   invalid={errors.iops !== ''}
            />
           <FormFeedback>{errors.iops}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="throughput">Throughput (*)</Label>
            <Input type="text" name="throughput" id="throughput" value={item.throughput || ''} placeholder="Enter throughput"
                   onChange={this.handleChange} onBlur={this.handleBlur('throughput')} autoComplete="throughput"
                   valid={errors.throughput === ''}
                   invalid={errors.throughput !== ''}
            />
           <FormFeedback>{errors.throughput}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="encrypted">Encrypted (*)</Label>
            <Input type="text" name="encrypted" id="encrypted" value={item.encrypted || ''} placeholder="Enter encrypted"
                   onChange={this.handleChange} onBlur={this.handleBlur('encrypted')} autoComplete="encrypted"
                   valid={errors.encrypted === ''}
                   invalid={errors.encrypted !== ''}
            />
           <FormFeedback>{errors.encrypted}</FormFeedback>
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

export default withRouter(LaunchConfigurationStorageEdit);