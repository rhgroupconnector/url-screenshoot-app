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
        this._isMounted = false;
        this.useScrollPosition = this.useScrollPosition.bind(this);
        this.resizeWindow = this.resizeWindow.bind(this);
        this.propsState = this.props.location.state[0];
    }
    routeTo = (path, state) => {
        this.props.history.push(path, [state])
    }

    componentDidMount(){
        this._isMounted = true;

        if(this._isMounted){
            let imgSrc= this.propsState.imgSrcDefault;
            this.setState({imgSrc});

            window.addEventListener('scroll', this.useScrollPosition)
            window.addEventListener('resize', this.resizeWindow)
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('scroll', this.useScrollPosition)
        window.removeEventListener('resize', this.resizeWindow)
    }

    resizeWindow(){
        let windowWidth = window.innerWidth;
        let currentUrl = this.props.match.url;
        let pathName = "../" + this.props.match.params.slug + "/";

        if(currentUrl.includes("desktop") && windowWidth <= 480 && this._isMounted){
            this.routeTo(pathName + "mobile");
            this.setState({
                imgSrc: this.propsState.imgSrcSub
            });
        }
      

        if(currentUrl.includes("mobile") && windowWidth > 480 && this._isMounted){
                this.routeTo(pathName + "desktop");
                this.setState({
                    imgSrc: this.propsState.imgSrcDefault
                });
        }
    }

    useScrollPosition(event){
        let scrollTop = event.srcElement.scrollingElement.scrollTop;

        this.setState({
            scrollPos: scrollTop
        })
    }

    render(){
        return(
            <Container fluid className="fullscreen">
                <Columns>
                    <Columns.Column size={12} className={this.state.scrollPos > 40 ? "sticky sticky-full" : "sticky"}>
                        <Button color="primary" onClick={() => this.routeTo("/")}>
                            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                            <span>Go back</span>
                        </Button>
                    </Columns.Column>
                    <Columns.Column size={12}>
                        { this.state.imgSrc === "" 
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