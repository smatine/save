import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class StorageAclList extends Component {

  constructor(props) {
    super(props);
    this.state = {storageAcls: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

  
    fetch(`${API_BASE_URL}/storages/${this.props.match.params.id}/storageAcls`)
      .then(response => response.json())
      .then(data => this.setState({storageAcls: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/storages/${accId}/storageAcls/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateStorageAcl = [...this.state.storageAcls].filter(i => i.id !== id);
      this.setState({storageAcls: updateStorageAcl});
    });
  }

  render() {
    const {storageAcls, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const storageAclList = storageAcls.map(storageAcl => {
      
      const link = FRT_BASE_URL + "/storages/" + storageAcl.storage.id; 
      const read = (storageAcl.read) ? 'Yes': 'No';
      const write = (storageAcl.write) ? 'Yes': 'No';
      
      const account = (storageAcl.account) ? storageAcl.account.id : '';

      const listObject = (storageAcl.listObject) ? 'Yes': 'No';
      const writeObject = (storageAcl.writeObject) ? 'Yes': 'No';

      return <tr key={storageAcl.id}>
        <td style={{whiteSpace: 'nowrap'}}>{storageAcl.id}</td>

        <td>{storageAcl.type}</td>
        <td>{account}</td>
        <td>{storageAcl.externalAccount}</td>
        <td>{storageAcl.groupe}</td>
        <td>{storageAcl.store}</td>
        <td>{read}</td>
        <td>{write}</td>
        <td>{listObject}</td>
        <td>{writeObject}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/storage/" + storageAcl.storage.id + "/storageacls/" + storageAcl.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(storageAcl.storage.id, storageAcl.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    
    const add = `${FRT_BASE_URL}/storage/${this.props.match.params.id}/storageacls/new`;
    const storage = `${FRT_BASE_URL}/storages`;
    

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={storage}>S3</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add S3 Acl</Button>
          </div>
          
          <h3>S3 Acl</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Type</th>
              <th width="5%">Account</th>
              <th width="5%">External Account</th>
              <th width="5%">Public access</th>
              <th width="5%">S3 log delivery group</th>

              <th width="5%">Read bucket permissions</th> 
              <th width="5%">Write bucket permissions</th>
              <th width="5%">List objects</th> 
              <th width="5%">Write objects</th> 
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {storageAclList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default StorageAclList;