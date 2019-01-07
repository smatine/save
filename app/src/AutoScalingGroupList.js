import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AutoScalingGroupList extends Component {

  constructor(props) {
    super(props);
    this.state = {autoScalingGroups: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/autoScalingGroups`)
      .then(response => response.json())
      .then(data => this.setState({autoScalingGroups: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/autoScalingGroups/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateAutoScalingGroup = [...this.state.autoScalingGroups].filter(i => i.id !== id);
      this.setState({autoScalingGroups: updateAutoScalingGroup});
    });
  }

  render() {
    const {autoScalingGroups, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const autoScalingGroupList = autoScalingGroups.map(autoScalingGroup => {
      
    const link = FRT_BASE_URL + "/vpcs/" + autoScalingGroup.vpc.id; 
    const linkAccount = FRT_BASE_URL + "/accounts/" + autoScalingGroup.account.id; 
    const loadBalancing= (autoScalingGroup.loadBalancing)? 'Yes': 'No'; 
    //const healthCheckType= (autoScalingGroup.healthCheckType)? 'Yes': 'No'; 
    const createAutoScalingGroup= (autoScalingGroup.createAutoScalingGroup)? 'Yes': 'No';      
    
    let subs='';
    if(autoScalingGroup.subnets && autoScalingGroup.subnets.length){
        autoScalingGroup.subnets.map(s => {  
          subs = subs + s.id + ":" + s.name + ":" + s.az.name + "| ";
      });
    }  

    let targetGroups='';
    if(autoScalingGroup.targetGroups && autoScalingGroup.targetGroups.length){
        autoScalingGroup.targetGroups.map(t => {  
          targetGroups = targetGroups + t.id + ":" + t.name  + "| ";
      });
    }  

    

      return <tr key={autoScalingGroup.id}>
        <td style={{whiteSpace: 'nowrap'}}>{autoScalingGroup.id}</td>
        <td>{autoScalingGroup.name}</td>
        <td><a href={linkAccount}>{autoScalingGroup.account.numAccount}</a></td>
        <td><a href={link}>{autoScalingGroup.vpc.name}</a></td>
        <td>{autoScalingGroup.launchConfiguration.id}</td>
		    <td>{subs}</td>
  
        <td>{autoScalingGroup.groupSize}</td>
        <td>{loadBalancing}</td>
        <td>{targetGroups}</td>
        <td>{autoScalingGroup.healthCheckType}</td>
        <td>{autoScalingGroup.healthCheckGracePeriod}</td>
        <td>{autoScalingGroup.instanceProtection}</td>
        <td>{autoScalingGroup.serviceLinkedRole}</td>
        <td>{createAutoScalingGroup}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/autoscalinggroup/" + autoScalingGroup.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
          
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/autoscalinggroups/" + autoScalingGroup.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(autoScalingGroup.vpc.id, autoScalingGroup.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>

    });

    const add = `${FRT_BASE_URL}/autoscalinggroups/new`;
  

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Auto Scaling Group</Button>
          </div>
          
          <h3>Auto Scaling Group</h3>
          <Table className="mt-4">
            <thead>
            <tr>
      
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Launch Configuration</th>
              <th width="5%">Subnet</th>

              <th width="5%">Group Size</th>
              <th width="5%">LoadBalancing</th>
              <th width="5%">Target Group</th>
              <th width="5%">HealthCheckType</th>
              <th width="5%">HealthCheckGracePeriod</th>
              <th width="5%">Instance Protection</th>
              <th width="5%">ServiceLinkedRole</th>
              <th width="5%">CreateAutoScalingGroup</th>

			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {autoScalingGroupList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
}

export default AutoScalingGroupList;