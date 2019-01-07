import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class StorageList extends Component {

  constructor(props) {
    super(props);
    this.state = {storages: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/storages`)
      .then(response => response.json())
      .then(data => this.setState({storages: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/storages/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateStorage = [...this.state.storages].filter(i => i.id !== id);
      this.setState({storages: updateStorage});
    });
  }

  render() {
    const {storages, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const storageList = storages.map(storage => {
      
    const link = FRT_BASE_URL + "/accounts/" + storage.account.id; 
    const versionning = (storage.versionning) ? 'Yes': 'No';
    const cloudWatchMetrics = (storage.cloudWatchMetrics) ? 'Yes': 'No';
    const encryption = (storage.encryption) ? 'Yes': 'No';
    const kms = (storage.kms) ? storage.kms.id : '';
    const serverAccessLoging = (storage.serverAccessLoging) ? 'Yes': 'No';

    const storageTarget = (storage.storageTarget) ? storage.storageTarget.id : '';
    
    const grantAmazonS3ReadAccess = (storage.grantAmazonS3ReadAccess) ? 'Yes': 'No';

   
      return <tr key={storage.id}>
        <td style={{whiteSpace: 'nowrap'}}>{storage.id}</td>
        <td>{storage.name}</td>

        <td>{storage.region.id} {storage.region.name}</td>
        <td>{versionning}</td>
        <td>{cloudWatchMetrics}</td>

         <td>{encryption}</td>
         <td>{storage.encryptionType}</td>
         <td>{kms}</td>

        <td>{serverAccessLoging}</td>
        <td>{storageTarget}</td>
        <td>{storage.targetPrefix}</td>

        
        <td>{grantAmazonS3ReadAccess}</td>

        <td>{storage.cors}</td>
        <td>{storage.text}</td>
        <td><a href={link}>{storage.account.numAccount}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/storage/" + storage.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/storage/" + storage.id + "/storageacls" }>Acls</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/storages/" + storage.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(storage.account.id, storage.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/storages/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add S3</Button>
          </div>
          
          <h3>S3</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
             
              <th width="5%">Region</th>
              <th width="5%">Versionning</th>
              <th width="5%">Cloud Watch Metrics</th>
              
              <th width="5%">Encryption</th>
              <th width="5%">Encryption Type</th>
              <th width="5%">Kms key</th>

              <th width="5%">Server Access Loging</th>
              <th width="5%">Storage Target</th>
              <th width="5%">Target Prefix</th>

              
              <th width="5%">AmazonS3ReadAccess</th>

              <th width="5%">Cors Configuration</th>
              <th width="5%">Description</th>
              <th width="5%">Account</th> 
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {storageList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default StorageList;