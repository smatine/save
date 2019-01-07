import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class EndPointList extends Component {

  constructor(props) {
    super(props);
    this.state = {endPoints: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/endPoints`)
      .then(response => response.json())
      .then(data => this.setState({endPoints: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/endPoints/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEndPoint = [...this.state.endPoints].filter(i => i.id !== id);
      this.setState({endPoints: updateEndPoint});
    });
  }

  render() {
    const {endPoints, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const endPointList = endPoints.map(endPoint => {
      
    const link = FRT_BASE_URL + "/vpcs/" + endPoint.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + endPoint.account.id;
    const fullAccess = (endPoint.fullAccess)? 'Yes': 'No';
    
    const policy = (endPoint.policy) ? endPoint.policy.id : '';
      return <tr key={endPoint.id}> 
        <td style={{whiteSpace: 'nowrap'}}>{endPoint.id}</td> 
        <td>{endPoint.name}</td>
        <td><a href={linkAccount}>{endPoint.account.numAccount}</a></td>
        <td>{endPoint.serviceName}</td>
      
        <td>{fullAccess}</td>
        <td><a href={link}>{endPoint.vpc.id}</a></td>
        <td>{endPoint.routeTable.id}</td>
        <td>{policy}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/endPoints/" + endPoint.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(endPoint.vpc.id, endPoint.id)} >Delete</Button>
          </ButtonGroup>
        </td>
      </tr>

    });

    const add = `${FRT_BASE_URL}/endPoints/new`;
  

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add EndPoint</Button>
          </div>
          
          <h3>EndPoint</h3>
          <Table className="mt-4">
            <thead>
            <tr>
      
              <th width="5%">Id</th> 
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Service Name</th> 
              
              <th width="5%">Full Access</th>
              <th width="5%">Vpc</th>
              <th width="5%">Route table</th>
              <th width="5%">Policy</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {endPointList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
}

export default EndPointList;