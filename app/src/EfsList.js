import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class EfsList extends Component {

  constructor(props) {
    super(props);
    this.state = {efss: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/efss`)
      .then(response => response.json())
      .then(data => this.setState({efss: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/efss/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEfs = [...this.state.efss].filter(i => i.id !== id);
      this.setState({efss: updateEfs});
    });
  }

  render() {
    const {efss, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const efsList = efss.map(efs => {
      
      const link = FRT_BASE_URL + "/vpcs/" + efs.vpc.id; 
      const linkAccount = FRT_BASE_URL + "/accounts/" + efs.account.id; 
      
      const sg = FRT_BASE_URL + "/subnetgroups/" + efs.subnetgroup.id;
      const encryption = (efs.encryption) ? 'Yes' : 'No';
      const kms = (efs.kms) ? efs.kms.id : '-';
      const encryptionType = (efs.encryption) ? efs.encryptionType : '-';
      const provisionedIo = (efs.throughputMode === 'Provisioned') ? efs.provisionedIo : '-';

      return <tr key={efs.id}>
        <td style={{whiteSpace: 'nowrap'}}>{efs.id}</td>

  

        <td>{efs.name}</td>
        <td><a href={linkAccount}>{efs.account.numAccount}</a></td>
        <td>{efs.performanceMode}</td>
        <td>{efs.throughputMode}</td>
        <td>{provisionedIo}</td>
        <td>{encryption}</td>
        <td>{encryptionType}</td>
        <td>{kms}</td>
        <td>{efs.kmsExterne}</td>


        <td>{efs.text}</td>
        <td><a href={link}>{efs.vpc.name}</a></td>
        <td><a href={sg}>{efs.subnetgroup.name}</a></td>
    


        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/efs/" + efs.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/efss/" + efs.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(efs.vpc.id, efs.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/efss/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Efs</Button>
          </div>
          
          <h3>Efs</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Performance Mode</th>
              <th width="5%">Throughput Mode</th>
              <th width="5%">Provisioned IO</th>
              <th width="5%">Encryption</th>
              <th width="5%">Encryption Type</th>
              <th width="5%">Kms</th>
              <th width="5%">Kms Externe</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {efsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default EfsList;