import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class LbList extends Component {

  constructor(props) {
    super(props);
    this.state = {lbs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/lbs`)
      .then(response => response.json())
      .then(data => this.setState({lbs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/lbs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateLb = [...this.state.lbs].filter(i => i.id !== id);
      this.setState({lbs: updateLb});
    });
  }

  render() {
    const {lbs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const lbList = lbs.map(lb => {
      
    const link = FRT_BASE_URL + "/vpcs/" + lb.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + lb.account.id;
    const isInternal= (lb.scheme)? 'internal': 'internet-facing';   
    const ipType = (lb.ipType === 'ipv6')? 'dualstack': lb.ipType;  
     
    const deletionProtection = (lb.deletionProtection)? 'Enabled' : 'Disabled';
    const crossZoneLoadBalancing = (lb.crossZoneLoadBalancing)? 'Enabled' : 'Disabled';
    const http2 = (lb.http2)? 'Enabled' : 'Disabled';
    const accessLogs = (lb.accessLogs)? 'Enabled' : 'Disabled';
    
    let subnets = '';
    const lbSubnets = lb.subnets.map(subnet => {
      subnets = subnets + '|' + subnet.id + ':' + subnet.name;
    })
    let sgs = '';
    const lbSgs = lb.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })

      return <tr key={lb.id}>
        <td style={{whiteSpace: 'nowrap'}}>{lb.id}</td>
        <td>{lb.name}</td>
        <td><a href={linkAccount}>{lb.account.numAccount}</a></td>
        <td>{isInternal}</td>
        <td>{lb.type}</td>
        <td>{ipType}</td>
        <td><a href={link}>{lb.vpc.name}</a></td>
         <td>{deletionProtection}</td>
         <td>{crossZoneLoadBalancing}</td>
         <td>{lb.idleTimeout}</td>
         <td>{http2}</td>
         <td>{accessLogs}</td>
         <td>{lb.connectionDraining}</td>
         <td>{subnets}</td>
         <td>{sgs}</td>
        <td>{lb.text}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/lb/" + lb.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/lb/" + lb.id + "/listeners" }>Listeners</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/lbs/" + lb.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(lb.vpc.id, lb.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/lbs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Lb</Button>
          </div>
          
          <h3>Lb</h3>
          <Table className="mt-4">
            <thead>
            <tr>
    
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Scheme</th>
              <th width="5%">Type</th>
              <th width="5%">IP address type</th>
              <th width="5%">Vpc</th> 

              <th width="5%">Deletion Protection</th>
              <th width="5%">Cross-Zone Load Balancing</th>
              <th width="5%">Idle timeout</th>
              <th width="5%">HTTP/2</th>
              <th width="5%">Access logs Disabled</th>
              <th width="5%">Connection Draining</th>
              <th width="5%">Subnets</th>
              <th width="5%">Security Group</th>
              <th width="5%">Description</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {lbList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default LbList;