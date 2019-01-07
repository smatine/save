import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class InstanceTypeList extends Component {

  constructor(props) {
    super(props);
    this.state = {instanceTypes: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(API_BASE_URL + '/instanceTypes')
      .then(response => response.json())
      .then(data => this.setState({instanceTypes: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/instanceTypes/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateInstanceType = [...this.state.instanceTypes].filter(i => i.id !== id);
      this.setState({instanceTypes: updateInstanceType});
    });
  }

  render() {
    const {instanceTypes, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const instanceTypeList = instanceTypes.map(instanceType => {
    const ebsOptimized = (instanceType.ebsOptimized) ? 'Yes':'-';

      return <tr key={instanceType.id}>
        <td style={{whiteSpace: 'nowrap'}}>{instanceType.id}</td>

		    <td>{instanceType.family}</td>  
        <td>{instanceType.type}</td>
        <td>{instanceType.vcpus}</td>
        <td>{instanceType.memory}</td>
		    <td>{instanceType.instanceStorage}</td>
        <td>{ebsOptimized}</td> 
        <td>{instanceType.networkPerformance}</td>
        
        <td>  
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/instancetypes/" + instanceType.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(instanceType.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={FRT_BASE_URL + "/instancetypes/new"}>Add Instance Type</Button>
          </div>
          <h3>InstanceType</h3>
          <Table className="mt-4">
            <thead>
            <tr>
			        <th width="10%">Id</th>
              <th width="10%">Family</th>
              <th width="10%">Type</th>
              <th width="10%">vCPUs</th>
              <th width="10%">Memory (GiB)</th>
              <th width="10%">Instance Storage (GB)</th>
              <th width="10%">EBS-Optimized Available</th>
              <th width="10%">Network Performance</th>
               
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {instanceTypeList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default InstanceTypeList;