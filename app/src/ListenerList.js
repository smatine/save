import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ListenerList extends Component {

  constructor(props) {
    super(props);
    this.state = {listeners: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/lbs/${this.props.match.params.id}/listeners`)
      .then(response => response.json())
      .then(data => this.setState({listeners: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/lbs/${accId}/listeners/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateListener = [...this.state.listeners].filter(i => i.id !== id);
      this.setState({listeners: updateListener});
    });
  }

  render() {
    const {listeners, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const listenerList = listeners.map(listener => {
      
      const link = FRT_BASE_URL + "/lbs/" + listener.lb.id; 
      const targetGroup = (listener.targetGroup !== null) ? listener.targetGroup.id : '';
      

      return <tr key={listener.id}>
        <td style={{whiteSpace: 'nowrap'}}>{listener.id}</td>

        <td>{listener.protocole}</td>
        <td>{listener.port}</td>
        <td><a href={link}>{listener.lb.name}</a></td>
        <td>{targetGroup}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/lb/" + listener.lb.id  + "/listeners/" + listener.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(listener.lb.id, listener.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/lb/${this.props.match.params.id}/listeners/new`;
    const listener = `${FRT_BASE_URL}/lbs`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={listener}>Lbs</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Listener</Button>
          </div>
          
          <h3>Listener</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Protocole</th>

              <th width="5%">Port</th>
              
              <th width="5%">Lb</th> 
              <th width="5%">Target group</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {listenerList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ListenerList;