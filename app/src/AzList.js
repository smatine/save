import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AzList extends Component {

  constructor(props) {
    super(props);
    this.state = {azs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/regions/${this.props.match.params.id}/azs`)
      .then(response => response.json())
      .then(data => this.setState({azs: data, isLoading: false}));
  }

  async remove(regId, id) {
    await fetch(`${API_BASE_URL}/regions/${regId}/azs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateAz = [...this.state.azs].filter(i => i.id !== id);
      this.setState({azs: updateAz});
    });
  }

  render() {
    const {azs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }
    
    const azList = azs.map(az => {
      
      const link = FRT_BASE_URL + "/regions/" + az.region.id; 

      let isDisabled = false;
      if(az.subnets.length !== 0) isDisabled=true;

      return <tr key={az.id}>
        <td style={{whiteSpace: 'nowrap'}}>{az.id}</td>

        <td>{az.name}</td>
        <td>{az.description}</td>
        <td><a href={link}>{az.region.name}</a></td>
		    

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/region/" + az.region.id +"/azs/" + az.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(az.region.id, az.id)} disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/region/${this.props.match.params.id}/azs/new`;
    const reg = `${FRT_BASE_URL}/regions`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={reg}>Regions</Button>
            &nbsp;&nbsp;&nbsp;<Button color="success" tag={Link} to={add}>Add Az</Button>
          </div>
          
          <h3>Az</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="20%">Id</th>
              <th width="20%">Name</th>
              <th width="20%">Description</th>
              <th width="20%">Region</th>
			        <th width="20%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {azList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default AzList;