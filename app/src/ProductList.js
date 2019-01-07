import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class ProductList extends Component {

  constructor(props) {
    super(props);
    this.state = {products: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`${API_BASE_URL}/products`)
      .then(response => response.json())
      .then(data => this.setState({products: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/trigrammes/${accId}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateProduct = [...this.state.products].filter(i => i.id !== id);
      this.setState({products: updateProduct});
    });
  }

  render() {
    const {products, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const productList = products.map(product => {
      
      const link = FRT_BASE_URL + "/trigrammes/" + product.trigramme.id; 

      return <tr key={product.id}>
        <td style={{whiteSpace: 'nowrap'}}>{product.id}</td>


        <td>{product.name}</td>
        <td>{product.mailList}</td>
        <td>{product.type}</td>
        <td>{product.bastion}</td>
        <td>{product.mailListAlert}</td>
		    <td>{product.appContext}</td>
        <td>{product.text}</td>

        <td><a href={link}>{product.trigramme.name}</a></td>
		    
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/products/" + product.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(product.trigramme.id, product.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/products/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Product</Button>
          </div>
          
          <h3>Product</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">mailList</th>
              <th width="5%">type</th>
              <th width="5%">bastion</th>
              <th width="5%">mailListAlert</th>
              <th width="5%">Context</th> 
              <th width="5%">Description</th>
              <th width="5%">Trigramme</th> 
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {productList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ProductList;