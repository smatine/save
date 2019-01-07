import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RuleSgList extends Component {

  constructor(props) {
    super(props);
    this.state = {ruleSgs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/sgs/${this.props.match.params.id}/ruleSgs`)
      .then(response => response.json())
      .then(data => this.setState({ruleSgs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/sgs/${accId}/ruleSgs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRuleSg = [...this.state.ruleSgs].filter(i => i.id !== id);
      this.setState({ruleSgs: updateRuleSg});
    });
  }

  render() {
    const {ruleSgs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const ruleSgList = ruleSgs.map(ruleSg => {
      
      const link = FRT_BASE_URL + "/sgs/" + ruleSg.sg.id; 
      const allowdeny= (ruleSg.allow)? 'Allow': 'Deny';
      

      return <tr key={ruleSg.id}>
        <td style={{whiteSpace: 'nowrap'}}>{ruleSg.id}</td>


        <td>{ruleSg.type}</td>
        
        <td>{ruleSg.ruleType}</td>
        <td>{ruleSg.protocol}</td>
        <td>{ruleSg.portRange}</td>
        <td>{ruleSg.cidr}</td>




        <td>{ruleSg.text}</td>
        <td><a href={link}>{ruleSg.sg.name}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/sg/" + ruleSg.sg.id  + "/ruleSgs/" + ruleSg.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(ruleSg.sg.id, ruleSg.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/sg/${this.props.match.params.id}/ruleSgs/new`;
    const sg = `${FRT_BASE_URL}/sgs`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={sg}>Sg</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add RuleSg</Button>
          </div>
          
          <h3>RuleSg</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">IN/OUT</th>
              
              <th width="5%">Type</th>
              <th width="5%">Protocol</th>
              <th width="5%">PortRange</th>
              <th width="5%">Source/Destination</th>
              
              <th width="5%">Description</th>
              <th width="5%">Sg</th> 
              
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {ruleSgList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RuleSgList;