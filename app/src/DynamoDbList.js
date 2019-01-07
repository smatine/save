import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';
class DynamoDbList extends Component {

  constructor(props) {
    super(props);
    this.state = {dynamoDbs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/dynamoDbs`)
      .then(response => response.json())
      .then(data => this.setState({dynamoDbs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/accounts/${accId}/dynamoDbs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateDynamoDb = [...this.state.dynamoDbs].filter(i => i.id !== id);
      this.setState({dynamoDbs: updateDynamoDb});
    });
  }

  render() {
    const {dynamoDbs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const dynamoDbList = dynamoDbs.map(dynamoDb => {
      
      const link = FRT_BASE_URL + "/accounts/" + dynamoDb.account.id; 

      return <tr key={dynamoDb.id}>
        <td style={{whiteSpace: 'nowrap'}}>{dynamoDb.id}</td>


        <td>{dynamoDb.name}</td>
        <td>{dynamoDb.text}</td>

        <td><a href={link}>{dynamoDb.account.numAccount}</a></td>
		    
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/dynamoDbs/" + dynamoDb.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(dynamoDb.account.id, dynamoDb.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/dynamoDbs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add DynamoDb</Button>
          </div>
          
          <h3>DynamoDb</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              
              <th width="5%">Description</th>
              <th width="5%">Account</th> 
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {dynamoDbList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default DynamoDbList;