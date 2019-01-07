import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';


class VpcList extends Component {

  constructor(props) {
    super(props);
    this.state = {vpcs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/vpcs`)
      .then(response => response.json())
      .then(data => this.setState({vpcs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/vpcs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateVpc = [...this.state.vpcs].filter(i => i.id !== id);
      this.setState({vpcs: updateVpc});
    });
  }

  render() {
    const {vpcs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const vpcList = vpcs.map(vpc => {
      
      const link = FRT_BASE_URL + "/accounts/" + vpc.account.id; 
      
      let cidr = '';
      cidr = "[Id:" + vpc.cidr.id + " Cidr:" + vpc.cidr.cidr + " Env:" + vpc.cidr.env + "]";
      let cid ='';
      cid = FRT_BASE_URL + '/vpcmanage/' + vpc.cidr.id;

      let nacls = '';
      if(vpc.nacls)vpc.nacls.map(s => {  
        nacls = nacls + s + "| "; 
      });

      let routeTables = '';
      if(vpc.routeTables)vpc.routeTables.map(s => {  
        routeTables = routeTables + s + "| "; 
      });

      let dhcps = '';
      if(vpc.dhcps)vpc.dhcps.map(s => {  
        dhcps = dhcps + s + "| "; 
      });

      let ps = '';
      const pss = vpc.products.map(p => {
        ps = ps + '|' + p.id + ':' + p.name;
      })
      
      return <tr key={vpc.id}>
        <td style={{whiteSpace: 'nowrap'}}>{vpc.id}</td>

		<td>{vpc.name}</td>
        <td><a href={cid}>{cidr}</a></td>
        <td><a href={link}>{vpc.account.numAccount}: {vpc.account.env}</a></td>
        <td>{ps}</td>
		<td>{vpc.text}</td>
        <td>{nacls}</td>
        <td>{routeTables}</td>
		<td>{dhcps}</td>
       

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/vpc/" + vpc.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/vpcs/" + vpc.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(vpc.account.id, vpc.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

   const add = `${FRT_BASE_URL}/vpcs/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Vpc</Button>
          </div>
          <h3>Vpc</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Id</th> 
              <th width="20%">Name</th>
              <th width="20%">Cidr</th>
              <th width="20%">Account</th>
              <th width="20%">Products</th>
			  <th width="20%">Description</th>
              <th width="20%">Nacl</th>
              <th width="20%">Route</th>
              <th width="20%">Dhcp</th>
			  <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {vpcList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default VpcList;