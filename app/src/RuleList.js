import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class RuleList extends Component {

  constructor(props) {
    super(props);
    this.state = {rules: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/nacls/${this.props.match.params.id}/rules`)
      .then(response => response.json())
      .then(data => this.setState({rules: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/nacls/${accId}/rules/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRule = [...this.state.rules].filter(i => i.id !== id);
      this.setState({rules: updateRule});
    });
  }

  render() {
    const {rules, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const ruleList = rules.map(rule => {
      
      const link = FRT_BASE_URL + "/nacls/" + rule.nacl.id; 
      const allowdeny= (rule.allow)? 'Allow': 'Deny';
      

      return <tr key={rule.id}>
        <td style={{whiteSpace: 'nowrap'}}>{rule.id}</td>


        <td>{rule.type}</td>
        


        <td>{rule.number}</td>
        <td>{rule.ruleType}</td>
        <td>{rule.protocol}</td>
        <td>{rule.portRange}</td>
        <td>{rule.cidr}</td>
        <td>{allowdeny}</td>




        <td>{rule.text}</td>
        <td><a href={link}>{rule.nacl.name}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/nacl/" + rule.nacl.id  + "/rules/" + rule.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(rule.nacl.id, rule.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/nacl/${this.props.match.params.id}/rules/new`;
    const nacl = `${FRT_BASE_URL}/nacls`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={nacl}>Nacl</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Rule</Button>
          </div>
          
          <h3>Rule</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">IN/OUT</th>
              

              <th width="5%">Rule</th>
              <th width="5%">Type</th>
              <th width="5%">Protocol</th>
              <th width="5%">PortRange</th>
              <th width="5%">Source/Destination</th>
              <th width="5%">Allow/Deny</th>


              <th width="5%">Description</th>
              <th width="5%">Nacl</th> 
              
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {ruleList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RuleList;