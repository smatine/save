import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RegionList extends Component {

  constructor(props) {
    super(props);
    this.state = {regions: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(API_BASE_URL + '/regions')
      .then(response => response.json())
      .then(data => this.setState({regions: data, isLoading: false}));

    //si account rattach?
  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/regions/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRegion = [...this.state.regions].filter(i => i.id !== id);
      this.setState({regions: updateRegion});
    });
  }

  render() {
    const {regions, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const regionList = regions.map(region => {
      
      let isDisabled = false;
      if(region.cidrs.length !== 0) isDisabled=true;
      //if(region.amis.length !== 0) isDisabled=true;
      //if(region.cidrs.length !== 0) isDisabled=true;

      return <tr key={region.id}>
        <td style={{whiteSpace: 'nowrap'}}>{region.id}</td>
		    <td>{region.name}</td>
		    <td>{region.description}</td>
        

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={`${FRT_BASE_URL}/region/${region.id}/azs`}>Azs</Button>&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={`${FRT_BASE_URL}/region/${region.id}/amis`}>Amis</Button>
          </ButtonGroup>          
        </td>
        
        <td>
          
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={`${FRT_BASE_URL}/regions/${region.id}`}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(region.id)} disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
          
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={`${FRT_BASE_URL}/regions/new`}>Add Region</Button>
          </div>
          <h3>Region</h3>
          <Table className="mt-4">
            <thead>
            <tr>
			        <th width="10%">Id</th>
              <th width="10%">Name</th>
              <th width="10%">Description</th>
              <th width="10%">Components</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {regionList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RegionList;