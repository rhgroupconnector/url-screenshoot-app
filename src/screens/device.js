import React from 'react';
import { Container, Columns, Button, Image } from 'react-bulma-components';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class DeviceView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imgSrc : ""
        }
    }
    routeTo = (path, state) => {
        this.props.history.push(path, [state])
    }

    async componentDidMount(){
        let imgSrc = await this.props.location.state[0].imgSrc[0].url;
        this.setState({imgSrc})
    }
    render(){
        return(
            <Container>
                <Columns>
                    <Columns.Column>
                        <Button color="primary" onClick={() => this.routeTo("/")}>
                            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                            <span>Go back</span>
                        </Button>
                    </Columns.Column>
                    <Columns.Column size={12}>
                        { this.state.imgSrc == "" 
                        ?   <p>Loading data ...</p>
                        :   <Image src={this.state.imgSrc} />
                        }
                    </Columns.Column>
                </Columns>
            </Container>
        )
    }
}

export default DeviceView;