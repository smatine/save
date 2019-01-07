import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RdsList extends Component {

  constructor(props) {
    super(props);
    this.state = {rdss: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/rdss`)
      .then(response => response.json())
      .then(data => this.setState({rdss: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/rdss/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRds = [...this.state.rdss].filter(i => i.id !== id);
      this.setState({rdss: updateRds});
    });
  }

  render() {
    const {rdss, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const rdsList = rdss.map(rds => {
      
    const link = FRT_BASE_URL + "/vpcs/" + rds.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + rds.account.id; 
    const linkProduct = FRT_BASE_URL + "/products/" + rds.product.id;
      
    const sg = FRT_BASE_URL + "/subnetgroups/" + rds.subnetgroup.id;
    let sgs = '';
    const eccSgs = rds.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })
    const multiAz = (rds.multiAz) ? 'Yes' : 'No';

    return <tr key={rds.id}>
      <td style={{whiteSpace: 'nowrap'}}>{rds.id}</td>


      <td>{rds.name}</td>
      <td>{rds.text}</td>

      <td><a href={linkAccount}>{rds.account.numAccount}</a></td>
      <td><a href={link}>{rds.vpc.name}</a></td>
      <td><a href={linkProduct}>{rds.product.name}</a></td>
      <td><a href={sg}>{rds.subnetgroup.name}</a></td>
      <td>{rds.az.id}</td>
      <td>{sgs}</td>
      <td>{rds.instanceType.id}</td>

      <td>{rds.env}</td>
      <td>{rds.type}</td>
      <td>{rds.dbEngineVesion}</td>
      <td>{rds.storageType}</td>
      <td>{rds.dbInstanceIdentifier}</td>
      <td>{rds.masterUserName}</td>
      <td>{rds.masterPassword}</td>
      <td>{rds.masterConfirmPassword}</td>
      <td>{multiAz}</td>
      <td>{rds.alocatedStorage}</td>
      <td>{rds.provisionedIops}</td>
      



      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/rdss/" + rds.id}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => this.remove(rds.vpc.id, rds.id)}>Delete</Button>
        </ButtonGroup>
      </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/rdss/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Rds</Button>
          </div>
          
          <h3>Rds</h3>
          <Table className="mt-4">
            <thead>
            <tr>


              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Description</th>
              <th width="5%">Account</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Product</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Az</th>
              <th width="5%">Security Group</th>
              <th width="5%">Instance Type</th>

              <th width="5%">env</th>
              <th width="5%">type</th>
              <th width="5%">dbEngineVesion</th>
              <th width="5%">storageType</th>
              <th width="5%">dbInstanceIdentifier</th>
              <th width="5%">masterUserName</th>
              <th width="5%">masterPassword</th>
              <th width="5%">masterConfirmPassword</th>
              <th width="5%">multiAz</th>
              <th width="5%">alocatedStorage</th>
              <th width="5%">provisionedIops</th>





              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {rdsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RdsList;