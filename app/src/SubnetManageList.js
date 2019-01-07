import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SubnetManageList extends Component {

  constructor(props) {
    super(props);
    this.state = {subnetcidrs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/cidrs/${this.props.match.params.id}/subnetcidrs`)
      .then(response => response.json())
      .then(data => this.setState({subnetcidrs: data, isLoading: false}));
  }

  async remove(cidrId, id) {
    await fetch(`${API_BASE_URL}/cidrs/${cidrId}/subnetcidrs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSubnetCidr = [...this.state.subnetcidrs].filter(i => i.id !== id);
      this.setState({subnetcidrs: updateSubnetCidr});
    });
  }

  render() {
    const {subnetcidrs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const subnetCidrList = subnetcidrs.map(subnetCidr => {
      
      const link = FRT_BASE_URL + "/vpcmanage/" + subnetCidr.cidr.id; ///vpcmanages/:idc/subnetmanage/:id   /vpcmanage/:id

      let sub = '';
      let subsub ='';
      if(subnetCidr.subnet) {
        sub = subnetCidr.subnet.id + ":" + subnetCidr.subnet.name ;///vpc/1000/subnets/1000
        subsub = FRT_BASE_URL + "/vpc/" + subnetCidr.subnet.vpc.id + "/subnets/" + subnetCidr.subnet.id;
      }
      let isDisabled = false;
      if(subnetCidr.subnet) isDisabled=true;

      return <tr key={subnetCidr.id}>
        <td style={{whiteSpace: 'nowrap'}}>{subnetCidr.id}</td>

		    <td>{subnetCidr.subnetCidr}</td>
         
        <td><a href={link}>{subnetCidr.cidr.cidr}</a></td>

        <td><a href={subsub}>{sub}</a></td>


		    <td>{subnetCidr.text}</td>
		
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/vpcmanages/" + subnetCidr.cidr.id + "/subnetmanage/" + subnetCidr.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(subnetCidr.cidr.id, subnetCidr.id)}  disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

   const add = `${FRT_BASE_URL}/vpcmanages/${this.props.match.params.id}/subnetmanage/new`;
   const trig = `${FRT_BASE_URL}/vpcmanage`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={trig}>Cidrs</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Subnet Cidr</Button>
          </div>
          <h3>Subnet</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Id</th> 
              <th width="20%">subnet</th> 
              <th width="20%">Cidr</th>

              <th width="20%">Subnet vpc</th>


			        <th width="20%">Description</th>
			        <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {subnetCidrList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SubnetManageList;