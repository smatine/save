import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class NaclList extends Component {

  constructor(props) {
    super(props);
    this.state = {nacls: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/nacls`)
      .then(response => response.json())
      .then(data => this.setState({nacls: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/nacls/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateNacl = [...this.state.nacls].filter(i => i.id !== id);
      this.setState({nacls: updateNacl});
    });
  }

  render() {
    const {nacls, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const naclList = nacls.map(nacl => {
      
    const link = FRT_BASE_URL + "/vpcs/" + nacl.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + nacl.account.id;
    const isdef= (nacl.def)? 'Yes': 'No';      
    
    let subs='';
    if(nacl.subnets && nacl.subnets.length){
        nacl.subnets.map(s => {  
          subs = subs + s.id + ":" + s.name + ":" + s.az.name + "| ";
      });
    }  

      return <tr key={nacl.id}>
        <td style={{whiteSpace: 'nowrap'}}>{nacl.id}</td>
        <td>{nacl.name}</td>
        <td><a href={linkAccount}>{nacl.account.numAccount}</a></td>
        <td>{isdef}</td>
        <td>{nacl.text}</td>
        <td><a href={link}>{nacl.vpc.name}</a></td>
		    <td>{subs}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/nacl/" + nacl.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/nacl/" + nacl.id + "/rules" }>Rules</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={API_BASE_URL + "/nacls/" + nacl.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(nacl.vpc.id, nacl.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/nacls/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Nacl</Button>
          </div>
          
          <h3>Nacl</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Default</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet association</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {naclList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default NaclList;