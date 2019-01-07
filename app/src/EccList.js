import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class EccList extends Component {

  constructor(props) {
    super(props);
    this.state = {eccs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    fetch(`${API_BASE_URL}/eccs`)
      .then(response => response.json())
      .then(data => this.setState({eccs: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/eccs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEcc = [...this.state.eccs].filter(i => i.id !== id);
      this.setState({eccs: updateEcc});
    });
  }

  render() {
    const {eccs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const eccList = eccs.map(ecc => {
      
    const link = FRT_BASE_URL + "/vpcs/" + ecc.vpc.id; 
    const links = FRT_BASE_URL + "/subnets/" + ecc.subnet.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + ecc.account.id;
    
    //autoAssignPublicIp shutdownBehaviour enableTerminationProtection encoded64 instanceType ami
    //monitoring useData useDataText

    const enableTerminationProtection = (ecc.enableTerminationProtection)? 'Yes': 'No';
    const encoded64 = (ecc.encoded64)? 'Yes': 'No';
    const userData = (ecc.userData)? 'Yes': 'No';
    const monitoring = (ecc.monitoring)? 'Yes': 'No';
    let sgs = '';
    const eccSgs = ecc.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })

    let role = (ecc.role) ? ecc.role.id : '';

    let ts= '';
    let targets = ecc.targets.map(target => {
      ts = ts + '|' + target.id;
    });
    let isUsed = false;
    isUsed = (ts === '') ? false : true;

      return <tr key={ecc.id}>
        <td style={{whiteSpace: 'nowrap'}}>{ecc.id}</td>

        <td>{ecc.name}</td>
        <td><a href={linkAccount}>{ecc.account.numAccount}</a></td>
        <td>{ecc.ami.id}</td>
        <td>{ecc.instanceType.id}</td>
        <td>{ecc.autoAssignPublicIp}</td>
        <td>{ecc.shutdownBehaviour}</td>
        <td>{enableTerminationProtection}</td>
        <td>{monitoring}</td>
        <td>{userData}</td>
        <td>{encoded64}</td>
        <td>{ecc.userDataText}</td>
        <td><a href={link}>{ecc.vpc.name}</a></td>
        <td><a href={links}>{ecc.subnet.name}</a></td>
        <td>{sgs}</td>
        <td>{role}</td>
        <td>{ts}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/ecc/" + ecc.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/ecc/" + ecc.id + "/eccStorages" }>Storages</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/ecc/" + ecc.id + "/eccNetworkinterfaces" }>Network Interfaces</Button>&nbsp;&nbsp;

            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/eccs/" + ecc.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(ecc.id)} disabled={isUsed}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/eccs/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Ecc</Button>
          </div>
          
          <h3>Ecc</h3>
          <Table className="mt-4">
            <thead>
            <tr>
    
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Ami</th>
              <th width="5%">Instance Type</th>
              <th width="5%">Auto Assign Public Ip</th>
              <th width="5%">Shutdown Behaviour</th>
              <th width="5%">Enable Termination Protection</th>
              <th width="5%">Monitoring</th>
              <th width="5%">user Data</th>
              <th width="5%">Encoded64</th>
              <th width="5%">User Data Text</th>
              <th width="5%">Vpc</th>
              <th width="5%">Subnet</th>
              <th width="5%">Sg</th>
              <th width="5%">Role</th>
              <th width="5%">Target</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {eccList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default EccList;