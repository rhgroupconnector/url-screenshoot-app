import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Container, Table, Button, Tag } from 'react-bulma-components';
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
    this._isMounted = false;
  }
  componentDidMount(){
    this._isMounted = true;
    if(this._isMounted){
      this.fetchRecords();
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  routeTo = (path, state) => {
    this.props.history.push('/' + path, [state])
  }

  async fetchRecords(){
    await base('Table 1').select({
      filterByFormula: "NOT({URL} = '')",
      view: "Grid view"
    }).eachPage(
      (records, fetchNextPage) => {
        if(records){
            this._isMounted && this.setState({records});
        }
        console.log(records)
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
                <th>Status</th>
                <th>View Screenshot</th>
              </tr>
            </thead>
            <tbody>
                {this.state.records.length > 0 ? (this.state.records.map(record =>
                  <tr key={record.id}>
                    <td>
                      {record.fields['Url']}
                    </td>
                    <td>
                      <Tag 
                        color={record.fields['Result'] === 'SUCCEEDED' ? 'success' : 
                              (record.fields['Result'] !== 'FAILED' ? 'info' :'danger')}>
                        {record.fields['Result']}
                      </Tag>
                    </td>
                    <td>
                      {record.fields['Result'] === "SUCCEEDED" ? 
                      <Button.Group>
                        <Button color="primary" 
                            onClick={() => 
                                this.routeTo(record.fields['Slug for page'] + '/mobile',
                                            { 
                                              imgSrcDefault : record.fields['Screenshot Mobile'][0].url,
                                              imgSrcSub : record.fields['Screenshot Desktop'][0].url,
                                              customScripts: {
                                                inBody: record.fields['In body'],
                                                inHead: record.fields['In head']
                                              }
                                            })}> 
                          <FontAwesomeIcon icon={faMobileAlt}>
                          </FontAwesomeIcon>
                        </Button>
                        <Button color="info" 
                            onClick={() => 
                              this.routeTo(record.fields['Slug for page'] + '/desktop',
                                          { 
                                            imgSrcDefault : record.fields['Screenshot Desktop'][0].url,
                                            imgSrcSub: record.fields['Screenshot Mobile'][0].url,
                                            customScripts: {
                                              inBody: record.fields['In body'],
                                              inHead: record.fields['In head']
                                            }
                                          })}>
                          <FontAwesomeIcon icon={faLaptop}></FontAwesomeIcon>
                        </Button>
                      </Button.Group>
                      : 
                      <p>No screenshot available</p>
                      }
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
