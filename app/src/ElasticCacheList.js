import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ElasticCacheList extends Component {

  constructor(props) {
    super(props);
    this.state = {elasticCaches: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/elasticCaches`)
      .then(response => response.json())
      .then(data => this.setState({elasticCaches: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/elasticCaches/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticCache = [...this.state.elasticCaches].filter(i => i.id !== id);
      this.setState({elasticCaches: updateElasticCache});
    });
  }

  render() {
    const {elasticCaches, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const elasticCacheList = elasticCaches.map(elasticCache => {
      
    const link = FRT_BASE_URL + "/vpcs/" + elasticCache.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + elasticCache.account.id; 
      
    const sg = FRT_BASE_URL + "/subnetgroups/" + elasticCache.subnetgroup.id;
    let sgs = '';
    const eccSgs = elasticCache.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })

    return <tr key={elasticCache.id}>
      <td style={{whiteSpace: 'nowrap'}}>{elasticCache.id}</td>


      <td>{elasticCache.name}</td>
      <td>{elasticCache.text}</td>

      <td><a href={linkAccount}>{elasticCache.account.numAccount}</a></td>
      <td><a href={link}>{elasticCache.vpc.name}</a></td>
      <td><a href={sg}>{elasticCache.subnetgroup.name}</a></td>

      <td>{sgs}</td>
      

      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/elasticCaches/" + elasticCache.id}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => this.remove(elasticCache.vpc.id, elasticCache.id)}>Delete</Button>
        </ButtonGroup>
      </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/elasticCaches/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add ElasticCache</Button>
          </div>
          
          <h3>ElasticCache</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Description</th>
              <th width="5%">Account</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Security Group</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {elasticCacheList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ElasticCacheList;