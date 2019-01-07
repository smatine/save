import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AmiList extends Component {

  constructor(props) {
    super(props);
    this.state = {amis: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/regions/${this.props.match.params.id}/amis`)
      .then(response => response.json())
      .then(data => this.setState({amis: data, isLoading: false}));
  }

  async remove(regId, id) {
    await fetch(`${API_BASE_URL}/regions/${regId}/amis/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateAmi = [...this.state.amis].filter(i => i.id !== id);
      this.setState({amis: updateAmi});
    });
  }

  render() {
    const {amis, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }
    
    const amiList = amis.map(ami => {
      
      const link = FRT_BASE_URL + "/regions/" + ami.region.id; 

      let isDisabled = false;
      //if(ami.subnets.length !== 0) isDisabled=true;

      return <tr key={ami.id}>
        <td style={{whiteSpace: 'nowrap'}}>{ami.id}</td>

        <td>{ami.name}</td>
        <td>{ami.amiId}</td>
        <td>{ami.text}</td>
        <td><a href={link}>{ami.region.name}</a></td>
        

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/region/" + ami.region.id +"/amis/" + ami.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(ami.region.id, ami.id)} disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/region/${this.props.match.params.id}/amis/new`;
    const reg = `${FRT_BASE_URL}/regions`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={reg}>Regions</Button>
            &nbsp;&nbsp;&nbsp;<Button color="success" tag={Link} to={add}>Add Ami</Button>
          </div>
          
          <h3>Ami</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="20%">Id</th>
              <th width="20%">Name</th>
              <th width="20%">Ami Id</th>
              <th width="20%">Description</th>
              <th width="20%">Region</th>
              <th width="20%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {amiList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default AmiList;