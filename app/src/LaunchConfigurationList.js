import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class LaunchConfigurationList extends Component {

  constructor(props) {
    super(props);
    this.state = {launchConfigurations: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    fetch(`${API_BASE_URL}/launchConfigurations`)
      .then(response => response.json())
      .then(data => this.setState({launchConfigurations: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/launchConfigurations/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateLaunchConfiguration = [...this.state.launchConfigurations].filter(i => i.id !== id);
      this.setState({launchConfigurations: updateLaunchConfiguration});
    });
  }

  render() {
    const {launchConfigurations, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const launchConfigurationList = launchConfigurations.map(launchConfiguration => {
      
    const link = FRT_BASE_URL + "/vpcs/" + launchConfiguration.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + launchConfiguration.account.id;
    //const links = "/subnets/" + launchConfiguration.subnet.id; 
    
    //name, kernalId, ramDiskId, purchasingOption, iamRole, ipAddressType,
    //monitoring, userData, encoded64, userDataText

    
    const encoded64 = (launchConfiguration.encoded64)? 'Yes': 'No';
    const userData = (launchConfiguration.userData)? 'Yes': 'No';
    const monitoring = (launchConfiguration.monitoring)? 'Yes': 'No';
    const purchasingOption = (launchConfiguration.purchasingOption)? 'Yes': 'No';
    let sgs = '';
    const launchConfigurationSgs = launchConfiguration.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })

      return <tr key={launchConfiguration.id}>
        <td style={{whiteSpace: 'nowrap'}}>{launchConfiguration.id}</td>

        <td>{launchConfiguration.name}</td>
        <td><a href={linkAccount}>{launchConfiguration.account.numAccount}</a></td>
        <td>{launchConfiguration.ami.id}</td>
        <td>{launchConfiguration.instanceType.id}</td>


        <td>{launchConfiguration.kernalId}</td>
        <td>{launchConfiguration.ramDiskId}</td>
        <td>{purchasingOption}</td>
        <td>{launchConfiguration.iamRole}</td>
        <td>{launchConfiguration.ipAddressType}</td>
        <td>{monitoring}</td>
        <td>{userData}</td>
        <td>{encoded64}</td>
        <td>{launchConfiguration.userDataText}</td>
        <td>{sgs}</td>
        <td><a href={link}>{launchConfiguration.vpc.name}</a></td>
        
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/launchconfiguration/" + launchConfiguration.id + "/launchConfigurationStorages" }>Storages</Button>&nbsp;&nbsp;

            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/launchconfigurations/" + launchConfiguration.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(launchConfiguration.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/launchconfigurations/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add LaunchConfiguration</Button>
          </div>
          
          <h3>Launch Configuration</h3>
          <Table className="mt-4">
            <thead>
            <tr>
    
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Ami</th>
              <th width="5%">Instance Type</th>

              <th width="5%">Kernal Id</th>
              <th width="5%">Ram Disk Id</th>
              <th width="5%">Purchasing Option</th>
              <th width="5%">Iam Role</th>
              <th width="5%">Ip Address Type</th>
              <th width="5%">Monitoring</th>
              <th width="5%">user Data</th>
              <th width="5%">Encoded64</th>
              <th width="5%">User Data Text</th>
              
              <th width="5%">Sg</th>
              <th width="5%">Vpc</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {launchConfigurationList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default LaunchConfigurationList;