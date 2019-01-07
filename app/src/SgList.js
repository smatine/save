import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class SgList extends Component {

  constructor(props) {
    super(props);
    this.state = {sgs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/sgs`)
      .then(response => response.json())
      .then(data => this.setState({sgs: data, isLoading: false}));

  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/vpcs/${accId}/sgs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSg = [...this.state.sgs].filter(i => i.id !== id);
      this.setState({sgs: updateSg});
    });
  }

  render() {
    const {sgs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const sgList = sgs.map(sg => {
      
      const link = FRT_BASE_URL + "/vpcs/" + sg.vpc.id; 
      const linkAccount = FRT_BASE_URL + "/accounts/" + sg.account.id;  
      const linkProduct = FRT_BASE_URL + "/products/" + sg.product.id;
          
      let lbs = '';
      const sgLbs = sg.lbs.map(lb => {
        lbs = lbs + '|' + lb;
      })
      
      let eccs = '';
      const sgEccs = sg.eccs.map(ecc => {
        eccs = eccs + '|' + ecc ;
      })

      let rdss = '';
      const sgRdss = sg.rdss.map(rds => {
        rdss = rdss + '|' + rds ;
      })

      let elasticaches = '';
      const sgElasticcaches = sg.elasticaches.map(e => {
        elasticaches = elasticaches + '|' + e ;
      })

      let launchConfigurations = '';
      const sglaunchConfigurations = sg.launchConfigurations.map(e => {
        launchConfigurations = launchConfigurations + '|' + e ;
      })

      const isRds = (sg.rdss && sg.rdss.length !== 0) ? true : false;
      const isElasticcaches = (sg.elasticaches && sg.elasticaches.length !== 0) ? true : false;
      const isLb = (sg.lbs && sg.lbs.length !== 0) ? true : false;
      const isEcc = (sg.eccs && sg.eccs.length !== 0) ? true : false;
      const isLaunchConfiguration = (sg.launchConfigurations && sg.launchConfigurations.length !== 0) ? true : false;

      return <tr key={sg.id}>
        <td style={{whiteSpace: 'nowrap'}}>{sg.id}</td>


        <td>{sg.nameTag}</td>
        <td>{sg.name}</td>
        <td><a href={linkAccount}>{sg.account.numAccount}</a></td>
        <td><a href={linkProduct}>{sg.product.name}</a></td>
        <td>{sg.text}</td>

        <td>{rdss}</td>
        <td>{elasticaches}</td>
        <td>{lbs}</td>
        <td>{eccs}</td>
        <td>{launchConfigurations}</td>
        <td><a href={link}>{sg.vpc.name}</a></td>
		    

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/sg/" + sg.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/sg/" + sg.id + "/ruleSgs" }>Rules</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/sgs/" + sg.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(sg.vpc.id, sg.id)} disabled={isRds || isLb || isEcc || isElasticcaches || isLaunchConfiguration}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/sgs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Sg</Button>
          </div>
          
          <h3>Sg</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name Tag</th>
              <th width="5%">Name</th>
              <th width="5%">Account</th>
              <th width="5%">Product</th>
              <th width="5%">Description</th>


              <th width="5%">Rds</th> 
              <th width="5%">Elc</th> 
              <th width="5%">Lb</th>               
              <th width="5%">Ec2</th>
              <th width="5%">Launch Conf</th>



              <th width="5%">Vpc</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {sgList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SgList;