import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Container, Table, Button, Section } from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMobileAlt, faLaptop} from '@fortawesome/free-solid-svg-icons';
import Airtable from 'airtable';

Airtable.configure({ 
  apiKey: 'keylS4L6voOsGvVAf'
});

var base = Airtable.base('appM0agS1MMh33WLz')

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      records: []
    }
  }
  async componentDidMount(){
    await base('Table 1').select({
      filterByFormula: "NOT({URL} = '')",
      view: "Grid view"
    }).eachPage(
      (records, fetchNextPage) => {
        if(records){
          console.log(records)
          this.setState({records});
        }
        fetchNextPage();
      }
    );
  }
  render(){
    return (
      <Container>
        <Table>
          <thead>
            <tr>
              <th>Website Url</th>
              <th>View Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {this.state.records.length > 0 ? (this.state.records.map(record =>
              <tr key={record.id}>
                <td>{record.fields['Url']}</td>
                <td>
                  <Button.Group>
                    <Button>
                      <FontAwesomeIcon icon={faMobileAlt}></FontAwesomeIcon>
                    </Button>
                    <Button>
                      <FontAwesomeIcon icon={faLaptop}></FontAwesomeIcon>
                    </Button>
                  </Button.Group>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3}>Loading data ...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      );
  }
}

export default App;
