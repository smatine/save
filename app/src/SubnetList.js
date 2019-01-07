import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SubnetList extends Component {

  constructor(props) {
    super(props);
    this.state = {subnets: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/subnets`)
      .then(response => response.json())
      .then(data => this.setState({subnets: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/subnets/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSubnet = [...this.state.subnets].filter(i => i.id !== id);
      this.setState({subnets: updateSubnet});
    });
  }

  render() {
    const {subnets, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const subnetList = subnets.map(subnet => {
      
      //const link = "/vpcs/" + subnet.vpc.id; // account/1000/vpcs/1000
      const link = FRT_BASE_URL + "/vpcs/" +subnet.vpc.id; // account/1000/vpcs/1000
      const linkAccount = FRT_BASE_URL + "/accounts/" + subnet.account.id; 
      const sub  = FRT_BASE_URL + "/vpcmanages/" + subnet.sCidr.cidr.id +"/subnetmanage/" + subnet.sCidr.id;
      
      let subs = '';
      if(subnet.subnetgroup)subnet.subnetgroup.map(s => {  
        subs = subs + s + "| "; 
      });

      let nacls = '';
      if(subnet.nacls)subnet.nacls.map(s => {  
        nacls = nacls + s + "| "; 
      });

      let routeTables = '';
      if(subnet.routetables)subnet.routetables.map(s => {  
        routeTables = routeTables + s + "| "; 
      });

      let lbs = '';
      if(subnet.lbs)subnet.lbs.map(s => {  
        lbs = lbs + s + "| "; 
      });

      let autoScalingGroups = '';
      if(subnet.autoScalingGroups)subnet.autoScalingGroups.map(s => {  
        autoScalingGroups = autoScalingGroups + s + "| "; 
      });

      let ps = '';
      const pss = subnet.products.map(p => {
        ps = ps + '|' + p.id + ':' + p.name;
      })
      
      return <tr key={subnet.id}>
        <td style={{whiteSpace: 'nowrap'}}>{subnet.id}</td>
        

        <td>{subnet.name}</td>
        <td><a href={linkAccount}>{subnet.account.numAccount}</a></td>
		<td><a href={sub}>{subnet.sCidr.id}:{subnet.sCidr.subnetCidr}</a></td>
        <td>{subnet.type}</td>
        <td><a href={link}>{subnet.vpc.id}:{subnet.vpc.name}</a></td>
        <td>{subnet.text}</td>
        <td>{ps}</td>
        <td>{subnet.az.id}:{subnet.az.name}</td>
		<td>{subs}</td>
        <td>{nacls}</td>
		<td>{routeTables}</td>

        <td>{lbs}</td>
        <td>{autoScalingGroups}</td>
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/subnet/" + subnet.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/subnets/" + subnet.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(subnet.vpc.id, subnet.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

   const add = `${FRT_BASE_URL}/subnets/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Subnet</Button>
          </div>
          <h3>Subnet</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="5%">Name</th> 
              <th width="5%">Account</th>
              <th width="5%">subnetCidr</th> 
              <th width="5%">Type</th>
              <th width="5%">Vpc</th>
			  <th width="5%">Description</th>
			  <th width="5%">Products</th>
              <th width="5%">Az</th>
              <th width="5%">Subnet group</th>
              <th width="5%">Nacl</th>
              <th width="5%">Route</th>
              <th width="5%">Lb</th>
              <th width="5%">Asg</th>
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {subnetList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SubnetList;