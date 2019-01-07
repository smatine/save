import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class AccountList extends Component {

  constructor(props) {
    super(props);
    this.state = {accounts: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/accounts`)
      .then(response => response.json())
      .then(data => this.setState({accounts: data, isLoading: false}));
  }

  async remove(triId, id) {
    await fetch(`${API_BASE_URL}/trigrammes/${triId}/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateAccount = [...this.state.accounts].filter(i => i.id !== id);
      this.setState({accounts: updateAccount});
    });
  }

  render() {
    const {accounts, isLoading} = this.state;


    if (isLoading) {
      return <p>Loading...</p>;
    }

    const accountList = accounts.map(account => {

      const link = FRT_BASE_URL + "/trigrammes/" + account.trigramme.id;  
      
      let ps = '';
      const pss = account.products.map(p => {
        ps = ps + '|' + p.id + ':' + p.name;
      })
      
      return <tr key={account.id}>
        <td style={{whiteSpace: 'nowrap'}}>{account.id}</td>

        <td>{account.numAccount}</td>
		<td>{account.env}</td>
        <td>{account.mailList}</td>
        <td>{account.alias}</td>
		<td><a href={link}>{account.trigramme.name}</a></td>
		<td>{ps}</td>
		<td>{account.text}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/accounts/" + account.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(account.trigramme.id, account.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/accounts/new`;
    //const prd = `/products/`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            
            <Button color="success" tag={Link} to={add}>Add Account</Button>
          </div>
          <h3>Account</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="5%">NumAccount</th>
              <th width="5%">Env</th> 

              
              <th width="5%">Mail</th> 
              <th width="5%">Alias</th>
              <th width="5%">Trigramme</th>
              <th width="5%">Products</th>
			  <th width="5%">Description</th>
              
			  <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {accountList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default AccountList;