import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { API_BASE_URL, FRT_BASE_URL } from './constants';

class TagStorageList extends Component {

  constructor(props) {
    super(props);
    this.state = {tags: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`${API_BASE_URL}/storages/${this.props.match.params.id}/tags`)
      .then(response => response.json())
      .then(data =>   this.setState({tags: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`${API_BASE_URL}/storages/${accId}/tags/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateTagStorage = [...this.state.tags].filter(i => i.id !== id);
      this.setState({tags: updateTagStorage});
    });
  }

  render() {
    const {tags, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const tagList = tags.map(tag => {
      
      const link = FRT_BASE_URL + "/storages/" + tag.storage.id; 

      return <tr key={tag.id}>
        <td style={{whiteSpace: 'nowrap'}}>{tag.id}</td>


        <td>{tag.key}</td>
        <td>{tag.value}</td>

        <td>{tag.text}</td>
        <td><a href={link}>{tag.storage.id}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={FRT_BASE_URL + "/storage/" + tag.storage.id  + "/tags/" + tag.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(tag.storage.id, tag.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `${FRT_BASE_URL}/storage/${this.props.match.params.id}/tags/new`;
    const storage = `${FRT_BASE_URL}/storages`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={storage}>Storage</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Tag</Button>
          </div>
          
          <h3>TagStorage</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Key</th>
              <th width="5%">Value</th>

              <th width="5%">Description</th>
              <th width="5%">Storage</th> 
              
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {tagList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default TagStorageList;