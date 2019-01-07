import React, { Component } from 'react';
import { Button, ButtonGroup, Container } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

let order = 'desc';
class VpcManageList extends Component {

  constructor(props) {
    super(props);
    this.state = {cidrs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(API_BASE_URL + '/cidrs')
      .then(response => response.json())
      .then(data => this.setState({cidrs: data, isLoading: false}));

  }

  async remove(id) {
    await fetch(`${API_BASE_URL}/cidrs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateCidr = [...this.state.cidrs].filter(i => i.id !== id);
      this.setState({cidrs: updateCidr});
    });
  }


  render() {

   const {cidrs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const defaultSorted = [{
      dataField: 'id',
      order: 'desc'
    }];

    const columns = [
    {
      dataField: 'id',
      text: 'ID',
      filter: textFilter({
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Id'
      }),
      /*headerStyle: (column, colIndex) => {
        if (colIndex % 2 === 0) {
          return {
            backgroundColor: '#81c784'
          };
        }
        return {
          backgroundColor: '#c8e6c9'
        };
      },*/
      sort: true
      /*sortCaret: (order, column) => {
        if (!order) return (<span>&nbsp;&nbsp;d/a</span>);
        else if (order === 'asc') return (<span>&nbsp;&nbsp;d/<font color="blue">a</font></span>);
        else if (order === 'desc') return (<span>&nbsp;&nbsp;<font color="blue">d</font>/a</span>);
        return null;
      }*/
    }, 
    {
      dataField: 'cidr',
      text: 'Cidr',
      filter: textFilter({
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Cidr'
      }),
      sort: true
    }, 
    
    {
      dataField: 'env',
      text: 'Env',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Env'
      }),
      sort: true
    }, 
    {
      dataField: 'text',
      text: 'Description',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Description'
      }),
      sort: true
    },

    {
      dataField: 'region.name',
      text: 'Region',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Region'
      }),
      sort: true,
      
      formatter: (cellContent, row) => {
          if (row.region && row.region.id) {
            let reg = '';
            reg=FRT_BASE_URL + '/regions/' + row.region.id ;
      
            let regc = '';
            regc = row.region.name;

            return (
              <a href={reg}>{regc}</a>
            );
          }
        }
    }, 
    
    /*, 
    {
      dataField: 'vpc',
      text: 'Vpc',
      isDummyField: true,
        formatter: (cellContent, row) => {
          if (row.vpc && row.vpc.id) {
            let vpc = '';
            vpc='/account/' + row.vpc.account.id + '/vpcs/' + row.vpc.id; 
      
            let vpcc = '';
            vpcc = "[Vpc:" + row.vpc.id + " Acc:" + row.vpc.account.numAccount + " Prd:" + row.vpc.account.product.name  + " Tri:" + row.vpc.account.product.trigramme.name +"]";

            return (
              <a href={vpc}>{vpcc}</a>
            );
          }
        }
    }*/, 
    {
      dataField: 'vpc.name',
      text: 'Vpc',
      //isDummyField: true,
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Vpc'
      }),
      sort: true,

        formatter: (cellContent, row) => {
          if (row.vpc && row.vpc.id) {
            let vpc = '';
            vpc=FRT_BASE_URL + '/account/' + row.vpc.account.id + '/vpcs/' + row.vpc.id; 
      
            let vpcc = '';
            vpcc = row.vpc.name;

            return (
              <a href={vpc}>{vpcc}</a>
            );
          }
        }
    }, 
    {
      dataField: 'vpc.account.numAccount',
      text: 'Account',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Account'
      }),
      sort: true,
      isDummyField: true,
        formatter: (cellContent, row) => {
          if (row.vpc && row.vpc.id) {
            let vpc = '';
            vpc=FRT_BASE_URL + '/product/' + row.vpc.account.product.id + '/accounts/' + row.vpc.account.id; 
      
            let vpcc = '';
            vpcc = row.vpc.account.numAccount;

            return (
              <a href={vpc}>{vpcc}</a>
            );
          }
        }
    },
    {
      dataField: 'vpc.account.product.name',
      text: 'Product',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Product'
      }),
      sort: true,
      isDummyField: true,
        formatter: (cellContent, row) => {
          if (row.vpc && row.vpc.id) {
            let vpc = '';
            vpc=FRT_BASE_URL + '/trigramme/' + row.vpc.account.product.trigramme.id + '/products/' + row.vpc.account.product.id; 
      
            let vpcc = '';
            vpcc = row.vpc.account.product.name ;

            return (
              <a href={vpc}>{vpcc}</a>
            );
          }
        }
    }, 
    {
      dataField: 'vpc.account.product.trigramme.name',
      text: 'Trigramme',
      filter: textFilter({
        caseSensitive: true,
        delay: 1000, // default is 500ms
        style: {
          backgroundColor: 'white'
        },
        className: 'test-classname',
        placeholder: 'Trigramme'
      }),
      sort: true,
      isDummyField: true,
        formatter: (cellContent, row) => {
          if (row.vpc && row.vpc.id) {
            let vpc = '';
            vpc=FRT_BASE_URL + '/trigrammes/' + row.vpc.account.product.trigramme.id; 
      
            let vpcc = '';
            vpcc = row.vpc.account.product.trigramme.name ;

            return (
              <a href={vpc}>{vpcc}</a>
            );
          }
        }
    }, 
    {
        dataField: 'vpc',
        text: 'Action',
        
        isDummyField: true,
          formatter: (cellContent, row) => {
          
            let isDisabled = false;
            if(row.vpc) isDisabled=true;

            return (
                   <ButtonGroup>
                    <Button size="sm" color="secondary" tag={Link} to={FRT_BASE_URL + "/vpcmanages/" + row.id + "/subnetmanage" }>Subnets Cidr</Button>&nbsp;&nbsp;
                    <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/vpcmanage/" + row.id}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => this.remove(row.id)}  disabled={isDisabled}>Delete</Button>
                  </ButtonGroup>

            );
          }    
    }
    ];
    
    return (
      
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={FRT_BASE_URL + "/vpcmanage/new"}>Add Cidr</Button>
          </div>
          <h3>Cidr</h3>
          <BootstrapTable  
            headerClasses="header-class" 
            keyField='id' 
            data={ cidrs } 
            columns={ columns }  
            bordered={ false } 
            defaultSorted={ defaultSorted } 
            filter={ filterFactory() } 
            pagination={ paginationFactory() }
            
            hover

          />
        </Container>

      </div>
      
    );
    
    /*
    const cidrList = cidrs.map(cidr => {
      
      let vpc = '';
      if(cidr.vpc) vpc='/account/' + cidr.vpc.account.id + '/vpcs/' + cidr.vpc.id; 
      let vpcc = '';
      if(cidr.vpc) vpcc = "[Vpc:" + cidr.vpc.id + " Acc:" + cidr.vpc.account.numAccount + " Prd:" + cidr.vpc.account.product.name  + " Tri:" + cidr.vpc.account.product.trigramme.name +"]";

      let isDisabled = false;
      if(cidr.vpc) isDisabled=true;

      /*return <tr key={cidr.id}>
        <td style={{whiteSpace: 'nowrap'}}>{cidr.id}</td>

		    <td>{cidr.cidr}</td>
        <td>{cidr.env}</td>
		    <td>{cidr.text}</td>
        <td><a href={vpc}>{vpcc}</a></td>
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/vpcmanage/" + cidr.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(cidr.id)}  disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
      
    });
    
    

    return (
      
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/vpcmanage/new">Add Cidr</Button>
          </div>
          <h3>Cidr</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th> 
              <th width="5%">Cidr</th> 
              <th width="5%">Env</th>
			        <th width="5%">Description</th>
              <th width="5%">Vpc</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {cidrList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
    */
  }
}

export default VpcManageList;