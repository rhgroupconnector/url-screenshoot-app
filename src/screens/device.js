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
            customScripts: ""
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
            let customScripts = this.propsState.customScripts;
            let inHead = this.domParser(customScripts.inHead);
            let inBody = this.domParser(customScripts.inBody);
            
            this.setState(
                {
                    imgSrc,
                    customScripts: {
                        inHead : inHead !== undefined ? inHead.childNodes[0] : undefined,
                        inBody : inBody !== undefined ? inBody.childNodes[0] : undefined
                }},
                this.loadScripts
            );

            window.addEventListener('scroll', this.useScrollPosition);
            window.addEventListener('resize', this.resizeWindow);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('scroll', this.useScrollPosition);
        window.removeEventListener('resize', this.resizeWindow);
        this.unloadScripts();
    }

    resizeWindow(){
        let windowWidth = window.innerWidth;
        let currentUrl = this.props.match.url;

        if(currentUrl.includes("desktop") && this._isMounted ){
            if(windowWidth <= 480){
                this.setState({
                    imgSrc: this.propsState.imgSrcSub
                });
            }

            if(windowWidth > 480){
                this.setState({
                    imgSrc: this.propsState.imgSrcDefault
                });
            }
        }
    }

    loadScripts(){
        if(this.state.customScripts.inHead !== undefined)
            document.head.appendChild(this.state.customScripts.inHead);
        
        if(this.state.customScripts.inBody !== undefined)
            document.body.appendChild(this.state.customScripts.inBody);
    }

    unloadScripts(){
        if(this.state.customScripts.inHead !== undefined)
            document.head.removeChild(this.state.customScripts.inHead);
        
        if(this.state.customScripts.inBody !== undefined)
            document.body.removeChild(this.state.customScripts.inBody);
    }

    domParser = (stringToParse) => {
        if(stringToParse !== undefined){
            return new DOMParser().parseFromString(stringToParse, "application/xml");
        }

        return undefined;
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