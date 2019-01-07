import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class KmsList extends Component {

  constructor(props) {
    super(props);
    this.state = {kmss: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/kmss`)
      .then(response => response.json())
      .then(data => this.setState({kmss: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/kmss/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateKms = [...this.state.kmss].filter(i => i.id !== id);
      this.setState({kmss: updateKms});
    });
  }

  render() {
    const {kmss, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const kmsList = kmss.map(kms => {
      
    const link = FRT_BASE_URL + "/accounts/" + kms.account.id; 

    let roles='';    
    if(kms.roles && kms.roles.length){
        kms.roles.map(t => {  
          roles = roles + t.id + ":" + t.name  + "| ";
      });
    }  
    let users = '';
    if(kms.users && kms.users.length){
        kms.users.map(t => {  
          users = users + t.id + ":" + t.name  + "| ";
      });
    }  

      return <tr key={kms.id}>
        <td style={{whiteSpace: 'nowrap'}}>{kms.id}</td> 
        <td>{kms.alias}</td>

        <td>{kms.keyMaterialOrigin}</td>
        <td><a href={link}>{kms.account.numAccount}</a></td>
        <td>{roles}</td>
        <td>{users}</td>
        <td>{kms.text}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/kmss/" + kms.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(kms.account.id, kms.id)} >Delete</Button>
          </ButtonGroup>
        </td>
      </tr>

    });

    const add = `${FRT_BASE_URL}/kmss/new`;
  

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Kms</Button>
          </div>
          
          <h3>Kms</h3>
          <Table className="mt-4">
            <thead>
            <tr>

              <th width="5%">Id</th> 
              <th width="5%">Alias</th>

              <th width="5%">Key Material Origin</th>
              <th width="5%">Account</th>
              <th width="5%">Role</th>
              <th width="5%">User</th>
              <th width="5%">Description</th>
              
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {kmsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
}

export default KmsList;