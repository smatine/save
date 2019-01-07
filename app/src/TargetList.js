import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class TargetList extends Component {

  constructor(props) {
    super(props);
    this.state = {targets: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/targetGroups/${this.props.match.params.id}/targets`)
      .then(response => response.json())
      .then(data => this.setState({targets: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/targetGroups/${accId}/targets/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateTarget = [...this.state.targets].filter(i => i.id !== id);
      this.setState({targets: updateTarget});
    });
  }

  render() {
    const {targets, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const targetList = targets.map(target => {
      
      const link = FRT_BASE_URL + "/targetgroups/" + target.targetGroup.id; 
      

      return <tr key={target.id}>
        <td style={{whiteSpace: 'nowrap'}}>{target.id}</td>

        <td>{target.ecc.id} {target.ecc.name}</td>
        <td>{target.port}</td>
        <td>{target.ecc.subnet.az.name}</td>
        <td><a href={link}>{target.targetGroup.name}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/targetgroup/" + target.targetGroup.id  + "/targets/" + target.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(target.targetGroup.id, target.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/targetgroup/${this.props.match.params.id}/targets/new`;
    const targetgroup = `${FRT_BASE_URL}/targetgroups`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={targetgroup}>Target Group</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Target</Button>
          </div>
          
          <h3>Target</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Ec2</th>
              <th width="5%">Port</th>
              <th width="5%">Az</th>
              <th width="5%">Target Group</th> 
              
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {targetList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default TargetList;