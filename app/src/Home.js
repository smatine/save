import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { Row, Col, Alert } from 'reactstrap';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Row>
            <Col>
                <Row>
                  <Col>
                    
                  </Col>
                </Row>
                <Row>
                  <Col>
                  
                  </Col>
                </Row>
            </Col>

            <Col>

            </Col>

            <Col>

            </Col>

            <Col>

            </Col>
          </Row>

          <Row>
            <Col>
            
            </Col>
            <Col>
            
            </Col>
            <Col>
            
            </Col>
            <Col>
        
            </Col>
          </Row>


          <Row>
            <Col>
            <Button  color="link"><Link to={`${FRT_BASE_URL}/regions`}>Manage Region</Link></Button>
            
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/vpcmanage`}>Manage Cidr</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/trigrammes`}>Manage Trigramme</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/products`}>Manage Products</Link></Button>
            </Col>
          </Row>
          
          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/accounts`}>Manage Accounts</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/vpcs`}>Manage Vpcs</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/subnets`}>Manage Subnets</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/subnetGroups`}>Manage Subnet Group</Link></Button>
            </Col>
          </Row>
          
          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/storages`}>Manage S3</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/ssms`}>Manage SSM</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/cognitos`}>Manage Cognito</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/dynamoDbs`}>Manage DynamoDb</Link></Button>
            </Col>
          </Row>

          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/Rdss`}>Manage Rds</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/efss`}>Manage Efs</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/elasticSearchs`}>Manage Elastic Search</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/elasticCaches`}>Manage Elastic Cache</Link></Button>
            </Col>
          </Row>
        
          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/nacls`}>Manage Nacl</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/sgs`}>Manage Security Group</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/routetables`}>Manage Route Table</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/peerings`}>Manage Peering</Link></Button>
            </Col>
          </Row>
      
          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/targetgroups`}>Manage Target Group</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/lbs`}>Manage LoadBalancer</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/instancetypes`}>Manage Instance Type</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/eccs`}>Manage Ec2</Link></Button>
            </Col>
          </Row>

          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/launchconfigurations`}>Manage Launch Configuration</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/autoscalinggroups`}>Manage Auto scaling Group</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/policys`}>Manage Policy</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/endpoints`}>Manage EndPoint</Link></Button>
            </Col>
          </Row>

          <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/roles`}>Manage Role</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/groups`}>Manage Group</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/users`}>Manage User</Link></Button>
            </Col>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/dhcps`}>Manage Dhcp Options Sets</Link></Button>
            </Col>
          </Row>

            <Row>
            <Col>
            <Button color="link"><Link to={`${FRT_BASE_URL}/kmss`}>Manage Kms</Link></Button>
            </Col>
            <Col>
            
            </Col>
            <Col>
            
            </Col>
            <Col>
           
            </Col>
          </Row>


        </Container>
      </div>
    );
  }
}

export default Home;