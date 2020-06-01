import React from 'react';
import { Container, Columns, Button, Image } from 'react-bulma-components';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class DeviceView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imgSrc : "",
            scrollPost: "",
            innerWidth : ""
        }
        this.useScrollPosition = this.useScrollPosition.bind(this);
    }
    routeTo = (path, state) => {
        this.props.history.push(path, [state])
    }

    async componentDidMount(){
        let imgSrc = await this.props.location.state[0].imgSrc[0].url;
        this.setState({imgSrc})
        window.addEventListener('scroll', this.useScrollPosition, true)
        window.addEventListener('resize', this.resizeWindow, true)
    }

    resizeWindow(event){
        // let windowWidth = window.innerWidth;

        // if(windowWidth > 480){
                
        // }else{

        // }
    }

    useScrollPosition(event){
        let scrollTop = event.srcElement.scrollingElement.scrollTop,
             itemTranslate = Math.min(0, scrollTop/3 - 60);
        this.setState({
            scrollPos: itemTranslate
        })
    }
    render(){
        return(
            <Container fluid className="fullscreen">
                <Columns>
                    <Columns.Column size={12} className="sticky" >
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