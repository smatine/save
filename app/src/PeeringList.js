import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class PeeringList extends Component {

  constructor(props) {
    super(props);
    this.state = {peerings: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/peerings`)
      .then(response => response.json())
      .then(data => this.setState({peerings: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/peerings/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatePeering = [...this.state.peerings].filter(i => i.id !== id);
      this.setState({peerings: updatePeering});
    });
  }

  render() {
    const {peerings, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const peeringList = peerings.map(peering => {
      
    const link = FRT_BASE_URL + "/vpcs/" + peering.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + peering.account.id; 
          
    const rVpc = peering.vpc.cidr.cidr;
    const rOwner = peering.vpc.account.numAccount;
    const rRegion  = peering.vpc.cidr.region.name;

    const aVpc = (peering.type === 'External') ? peering.peeringAccepterExternal.vpcId : peering.peeringAccepterInternal.vpc.cidr.cidr;
    const aOwner = (peering.type === 'External') ? peering.peeringAccepterExternal.owner : peering.peeringAccepterInternal.vpc.account.numAccount;
    const aRegion  = (peering.type === 'External') ? peering.peeringAccepterExternal.region.name : peering.peeringAccepterInternal.vpc.cidr.region.name;

    let routeTables = '';
      if(peering.routes)peering.routes.map(s => {  
        routeTables = routeTables + s.routeTable.id + ":" + s.routeTable.name + "| "; 
    });

    return <tr key={peering.id}>
        <td style={{whiteSpace: 'nowrap'}}>{peering.id}</td>
        <td>{peering.name}</td>
        <td><a href={linkAccount}>{peering.account.numAccount}</a></td>
        <td>{peering.type}</td>
        <td>{peering.text}</td>
        
        <td>{rVpc}</td>
        <td>{rOwner}</td>
        <td>{rRegion}</td>
        <td>{aVpc}</td>
        <td>{aOwner}</td>
        <td>{aRegion}</td>
        <td>{routeTables}</td>
        <td><a href={link}>{peering.vpc.name}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/peering/" + peering.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/peerings/" + peering.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(peering.vpc.id, peering.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/peerings/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Peering</Button>
          </div>
          
          <h3>Peering</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Type</th>
              <th width="5%">Description</th>

              <th width="10%">requester Vpc</th>
              <th width="10%">requester Owner</th>
              <th width="10%">requester region</th>
               
              <th width="10%">Accepter Vpc</th>
              <th width="10%">Accepter Owner</th>
              <th width="10%">Accepter region</th>
               
              <th width="10%">Route table</th>
              <th width="5%">Vpc</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {peeringList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default PeeringList;