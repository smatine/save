import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ElasticSearchList extends Component {

  constructor(props) {
    super(props);
    this.state = {elasticSearchs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/elasticSearchs`)
      .then(response => response.json())
      .then(data => this.setState({elasticSearchs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/elasticSearchs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticSearch = [...this.state.elasticSearchs].filter(i => i.id !== id);
      this.setState({elasticSearchs: updateElasticSearch});
    });
  }

  async remove2(id) {
    await fetch(`${API_BASE_URL}/elasticSearch/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticSearch = [...this.state.elasticSearchs].filter(i => i.id !== id);
      this.setState({elasticSearchs: updateElasticSearch});
    });
  }

  render() {
    const {elasticSearchs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const elasticSearchList = elasticSearchs.map(elasticSearch => {
      
      const link = (elasticSearch.vpc) ? FRT_BASE_URL + "/vpcs/" + elasticSearch.vpc.id : ''; 
      const linkAccount = FRT_BASE_URL + "/accounts/" + elasticSearch.account.id; 
      
      const sg = (elasticSearch.subnetgroup) ? FRT_BASE_URL + "/subnetgroups/" + elasticSearch.subnetgroup.id : '';
      const sgName = (elasticSearch.subnetgroup) ? elasticSearch.subnetgroup.name : '';

      const vpc = (elasticSearch.vpc) ? <a href={link}>{elasticSearch.vpc.name}</a> : '';

      const del = (elasticSearch.vpc) ? <Button size="sm" color="danger" onClick={() => this.remove(elasticSearch.vpc.id, elasticSearch.id)}>Delete</Button>:
                                        <Button size="sm" color="danger" onClick={() => this.remove2(elasticSearch.id)}>Delete</Button>
      

      const isPrivate = (elasticSearch.prive)? 'Privtae VPC':'Public';

      const enableDedicatedMaster = (elasticSearch.enableDedicatedMaster) ? 'Yes': 'No';
      const enableZoneAwareness = (elasticSearch.enableZoneAwareness) ? 'Yes': 'No';
      const enableEncrypt = (elasticSearch.enableEncrypt) ? 'Yes': 'No';
      const nodeToNodeEncryption = (elasticSearch.nodeToNodeEncryption) ? 'Yes': 'No';
      
      //nodes
      let nodeInstance = {"id": "", "instanceType": ""};
      let nodeMaster = {"id": "", "instanceType": ""};
      //console.log("-------------------");
      if(elasticSearch.nodes && elasticSearch.nodes.length){
        elasticSearch.nodes.map(node => { 
           if(node.type === 'instance')  
           {
              nodeInstance.instanceCount = node.instanceCount;
              nodeInstance.instanceType = node.instanceType.id;
           }
           else if(node.type === 'master') 
           {
              nodeMaster.instanceCount = node.instanceCount;
              nodeMaster.instanceType = node.instanceType.id;

            }
           
           //console.log("node.id=" + node.id + "   " + elasticSearch.name);
        });
      }
       
      const allowExplicitIndex = (elasticSearch.allowExplicitIndex) ? 'Yes': 'No';
      return <tr key={elasticSearch.id}>
        <td style={{whiteSpace: 'nowrap'}}>{elasticSearch.id}</td>


        <td>{elasticSearch.name}</td>
        <td><a href={linkAccount}>{elasticSearch.account.numAccount}</a></td>
        <td>{isPrivate}</td>
        <td>{elasticSearch.text}</td>
        <td>{vpc}</td>
        <td><a href={sg}>{sgName}</a></td>
        <td>{elasticSearch.domainName}</td>
        <td>{elasticSearch.version}</td>
        <td>{nodeInstance.instanceCount}</td>
        <td>{nodeInstance.instanceType}</td>
        <td>{enableDedicatedMaster}</td>
        <td>{nodeMaster.instanceCount}</td>
        <td>{nodeMaster.instanceType}</td>
        <td>{enableZoneAwareness}</td>
        <td>{elasticSearch.storageType}</td>
        <td>{elasticSearch.volumeType}</td>
        <td>{elasticSearch.volumeSize}</td>
        <td>{elasticSearch.provisionedIops}</td>
        <td>{enableEncrypt}</td>
        <td>{elasticSearch.snapshotConfiguration} UTC</td>
        <td>{allowExplicitIndex}</td>
        <td>{elasticSearch.cacheSize}</td>
        <td>{elasticSearch.maxClauseCount}</td>
        <td>{nodeToNodeEncryption}</td>
        <td>{elasticSearch.accessPolicy}</td>
   
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/elasticSearchs/" + elasticSearch.id}>Edit</Button>
            {del}
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/elasticSearchs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add ElasticSearch</Button>
          </div>
          
          <h3>ElasticSearch</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Private Vpc/ Public</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Domain Name</th>
              <th width="5%">Version</th>
              <th width="5%">Instance Count</th>
              <th width="5%">Instance Type</th>
              <th width="5%">Enable Dedicated Master</th>
              <th width="5%">Dedicated Master InstanceType</th>
              <th width="5%">Dedicated Master InstanceCount</th>
              <th width="5%">Enable Zone Awareness</th>
              <th width="5%">StorageType</th>
              <th width="5%">VolumeType</th>
              <th width="5%">VolumeSize</th>
              <th width="5%">Provisioned Iops</th>
              <th width="5%">Enable Encrypt</th>
              <th width="5%">SnapshotConfiguration (UTC)</th>
              <th width="5%">rest.action.multi.allow_explicit_index</th>
              <th width="5%">indices.fielddata.cache.size</th>
              <th width="5%">indices.query.bool.max_clause_count</th>
              <th width="5%">NodeToNodeEncryption</th>
              <th width="5%">Access Policy</th>

              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {elasticSearchList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ElasticSearchList;