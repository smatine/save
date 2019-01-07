import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SubnetGroupList extends Component {

  constructor(props) {
    super(props);
    this.state = {subnetGroups: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/subnetGroups`)
      .then(response => response.json())
      .then(data => this.setState({subnetGroups: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/subnetGroups/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSubnetGroup = [...this.state.subnetGroups].filter(i => i.id !== id);
      this.setState({subnetGroups: updateSubnetGroup});
    });
  }

  render() {
    const {subnetGroups, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const subnetGroupList = subnetGroups.map(subnetGroup => {
      
      const link = FRT_BASE_URL + "/vpcs/" + subnetGroup.vpc.id; 
      const linkAccount = FRT_BASE_URL + "/accounts/" + subnetGroup.account.id; 
      const linkProduct = FRT_BASE_URL + "/products/" + subnetGroup.product.id;
      
      let subs='';
      if(subnetGroup.subnets && subnetGroup.subnets.length){
                //console.log("subnet:");
                subnetGroup.subnets.map(s => {  
                  //alert("subnet:" + s.name);
                  subs = subs + s.id + ":" + s.name + ":" + s.az.name + "| ";
                  //console.log("subs=" + subs);
              });
      }

      return <tr key={subnetGroup.id}>
        <td style={{whiteSpace: 'nowrap'}}>{subnetGroup.id}</td>


        <td>{subnetGroup.name}</td>
        <td><a href={linkAccount}>{subnetGroup.account.numAccount}</a></td>
        <td>{subnetGroup.type}</td>
        <td>{subnetGroup.text}</td>

        <td><a href={link}>{subnetGroup.vpc.name}</a></td>
        <td><a href={linkProduct}>{subnetGroup.product.name}</a></td> 
		<td>{subs}</td>


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/subnetGroups/" + subnetGroup.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(subnetGroup.vpc.id, subnetGroup.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/subnetGroups/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add SubnetGroup</Button>
          </div>
          
          <h3>SubnetGroup</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Type</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Product</th> 
              <th width="5%">Subnets</th>
			  <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {subnetGroupList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SubnetGroupList;