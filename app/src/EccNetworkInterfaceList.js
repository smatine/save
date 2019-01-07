import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class EccNetworkInterfaceList extends Component {

  constructor(props) {
    super(props);
    this.state = {eccNetworkInterfaces: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/eccs/${this.props.match.params.id}/eccNetworkInterfaces`)
      .then(response => response.json())
      .then(data => this.setState({eccNetworkInterfaces: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/eccs/${accId}/eccNetworkInterfaces/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEccNetworkInterface = [...this.state.eccNetworkInterfaces].filter(i => i.id !== id);
      this.setState({eccNetworkInterfaces: updateEccNetworkInterface});
    });
  }

  render() {
    const {eccNetworkInterfaces, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const eccNetworkInterfaceList = eccNetworkInterfaces.map(eccNetworkInterface => {
      
      const link = FRT_BASE_URL + "/eccs/" + eccNetworkInterface.ecc.id; 
      const deleteOnTermination= (eccNetworkInterface.deleteOnTermination)? 'Yes': 'No';
      

      return <tr key={eccNetworkInterface.id}>
        <td style={{whiteSpace: 'nowrap'}}>{eccNetworkInterface.id}</td>


        <td>{eccNetworkInterface.device}</td>
        <td>{eccNetworkInterface.networkInterface}</td>
        <td>{eccNetworkInterface.primaryIp}</td>
        <td>{eccNetworkInterface.secondaryIp}</td>
        <td>{eccNetworkInterface.ipv6Ips}</td>
        

        <td><a href={link}>{eccNetworkInterface.ecc.id}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/ecc/" + eccNetworkInterface.ecc.id  + "/eccNetworkInterfaces/" + eccNetworkInterface.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(eccNetworkInterface.ecc.id, eccNetworkInterface.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/ecc/${this.props.match.params.id}/eccNetworkInterfaces/new`;
    const ecc = `${FRT_BASE_URL}/eccs`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={ecc}>Ec2</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Ec2 Network Interface</Button>
          </div>
          
          <h3>Ec2 Network Interface</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
                    
              <th width="5%">Id</th>
              <th width="5%">Device</th>
              <th width="5%">NetworkInterface</th>
              <th width="5%">PrimaryIp</th>
              <th width="5%">SecondaryIp</th>
              <th width="5%">Ipv6Ips</th>
              
              <th width="5%">Ecc</th> 
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {eccNetworkInterfaceList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default EccNetworkInterfaceList;