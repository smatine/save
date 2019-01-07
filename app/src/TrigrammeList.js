import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class TrigrammeList extends Component {

  constructor(props) {
    super(props);
    this.state = {trigrammes: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(API_BASE_URL + '/trigrammes')
      .then(response => response.json())
      .then(data => this.setState({trigrammes: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/trigrammes/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateTrigramme = [...this.state.trigrammes].filter(i => i.id !== id);
      this.setState({trigrammes: updateTrigramme});
    });
  }

  render() {
    const {trigrammes, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const trigrammeList = trigrammes.map(trigramme => {
      
      return <tr key={trigramme.id}>
        <td style={{whiteSpace: 'nowrap'}}>{trigramme.id}</td>
		    <td>{trigramme.name}</td>
        <td>{trigramme.owner}</td>

        <td>{trigramme.irtCode}</td>
        
        <td>{trigramme.mailList}</td>
		    <td>{trigramme.description}</td>
        

        
        <td>
          
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/trigrammes/" + trigramme.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(trigramme.id)}>Delete</Button>
          </ButtonGroup>
          
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={FRT_BASE_URL + "/trigrammes/new"}>Add TRI</Button>
          </div>
          <h3>Trigramme</h3>
          <Table className="mt-4">
            <thead>
            <tr>
			        <th width="10%">Id</th>
              <th width="10%">Name</th>
              <th width="10%">Owner</th>
              <th width="10%">IRT Code</th>
              
              <th width="10%">Mailling List</th>
              <th width="10%">Description</th>
              
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {trigrammeList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default TrigrammeList;