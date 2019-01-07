import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RoleList extends Component {

  constructor(props) {
    super(props);
    this.state = {roles: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/roles`)
      .then(response => response.json())
      .then(data => this.setState({roles: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRole = [...this.state.roles].filter(i => i.id !== id);
      this.setState({roles: updateRole});
    });
  }

  render() {
    const {roles, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const roleList = roles.map(role => {
      
    const link = FRT_BASE_URL + "/accounts/" + role.account.id; 

    let policies='';    
    if(role.policys && role.policys.length){
        role.policys.map(t => {  
          policies = policies + t.id + ":" + t.name  + "| ";
      });
    } 
    let isUsed = false;
    //if(roles !== '' || groups !== '' || endPoints !== '') isUsed = true;

      return <tr key={role.id}>
        <td style={{whiteSpace: 'nowrap'}}>{role.id}</td> 
        <td>{role.name}</td>
        <td>{role.serviceName}</td>
        <td><a href={link}>{role.account.numAccount}</a></td>
        <td>{role.description}</td>
        <td>{policies}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/roles/" + role.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(role.account.id, role.id)} disabled={isUsed}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>

    });

    const add = `${FRT_BASE_URL}/roles/new`;
  

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Role</Button>
          </div>
          
          <h3>Role</h3>
          <Table className="mt-4">
            <thead>
            <tr>
      
              <th width="5%">Id</th> 
              <th width="5%">Name</th>
              <th width="5%">Service Name</th>
              <th width="5%">Account</th>
              <th width="5%">Description</th>
              <th width="5%">Policies</th>
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {roleList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
}

export default RoleList;