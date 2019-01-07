import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class PolicyList extends Component {

  constructor(props) {
    super(props);
    this.state = {policys: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/policys`)
      .then(response => response.json())
      .then(data => this.setState({policys: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/policys/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatePolicy = [...this.state.policys].filter(i => i.id !== id);
      this.setState({policys: updatePolicy});
    });
  }

  render() {
    const {policys, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const policyList = policys.map(policy => {
      
    const link = FRT_BASE_URL + "/accounts/" + policy.account.id; 
/*
    const loadBalancing= (policy.loadBalancing)? 'Yes': 'No'; 
    const createPolicy= (policy.createPolicy)? 'Yes': 'No';      
    
    let subs='';
    if(policy.subnets && policy.subnets.length){
        policy.subnets.map(s => {  
          subs = subs + s.id + ":" + s.name + ":" + s.az.name + "| ";
      });
    }  
*/
    let roles='';
    if(policy.roles && policy.roles.length){
        policy.roles.map(t => {  
          roles = roles + t + "| ";
      });
    }  
    let groups='';
    if(policy.groups && policy.groups.length){
        policy.groups.map(t => {  
          groups = groups + t + "| ";
      });
    }  
    let endPoints='';    
    if(policy.endPoints && policy.endPoints.length){
        policy.endPoints.map(t => {  
          endPoints = endPoints + t  + "| ";
      });
    }  
    let isUsed = false;
    if(roles !== '' || groups !== '' || endPoints !== '') isUsed = true;

      return <tr key={policy.id}>
        <td style={{whiteSpace: 'nowrap'}}>{policy.id}</td> 
        <td>{policy.name}</td>
        <td>{policy.policyJson}</td>
        <td><a href={link}>{policy.account.numAccount}</a></td>
        <td>{policy.description}</td>
        <td>{roles}</td>
        <td>{groups}</td>
        <td>{endPoints}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/policys/" + policy.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(policy.account.id, policy.id)} disabled={isUsed}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>

    });

    const add = `${FRT_BASE_URL}/policys/new`;
  

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Policy</Button>
          </div>
          
          <h3>Policy</h3>
          <Table className="mt-4">
            <thead>
            <tr>
      
              <th width="5%">Id</th> 
              <th width="5%">Name</th>
              <th width="5%">Policy Json</th>
              <th width="5%">Account</th>
              <th width="5%">Description</th>
              <th width="5%">Roles</th>
              <th width="5%">Groups</th>
              <th width="5%">EndPoints</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {policyList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
}

export default PolicyList;